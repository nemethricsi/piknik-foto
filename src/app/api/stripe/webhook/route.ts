import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    await handleCheckoutCompleted(session)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email ?? session.metadata?.customer_email
  const phone = session.metadata?.phone
  const slotId = session.metadata?.time_slot_id
  const fullName = session.customer_details?.name ?? null
  const spaceIdx = fullName?.indexOf(" ") ?? -1
  const firstName = spaceIdx >= 0 ? fullName!.slice(0, spaceIdx) : fullName
  const lastName = spaceIdx >= 0 ? fullName!.slice(spaceIdx + 1) : null
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : null
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null

  if (!email || !slotId) return

  const supabase = createServiceClient()

  // Fetch slot times
  const { data: slot } = await supabase
    .from("time_slot")
    .select("start_time, end_time")
    .eq("id", slotId)
    .single()

  if (!slot) return

  // Upsert customer
  const { data: customer } = await supabase
    .from("customer")
    .upsert(
      { email, phone_number: phone ?? null, stripe_id: stripeCustomerId, first_name: firstName, last_name: lastName },
      { onConflict: "email", ignoreDuplicates: false }
    )
    .select("id")
    .single()

  if (!customer) return

  // Create booking with slot times — upsert so duplicate webhook deliveries are no-ops
  const { data: booking } = await supabase
    .from("booking")
    .upsert(
      {
        customer_id: customer.id,
        stripe_payment_intent: paymentIntent,
        status: "booked",
        start_time: slot.start_time,
        end_time: slot.end_time,
      },
      { onConflict: "stripe_payment_intent", ignoreDuplicates: true }
    )
    .select("id")
    .single()

  if (!booking) return

  // Link the time slot to the booking
  await supabase
    .from("time_slot")
    .update({ booking_id: booking.id, revealed: false })
    .eq("id", slotId)
}
