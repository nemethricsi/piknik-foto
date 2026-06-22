"use server"

import { redirect } from "next/navigation"
import { stripe } from "@/lib/stripe"

type State = { error: string | null }

export async function createCheckout(
  _prev: State,
  formData: FormData
): Promise<State> {
  const email = formData.get("email")?.toString().trim()
  const phone = formData.get("phone")?.toString().trim()

  if (!email || !phone) {
    return { error: "Email and phone number are required." }
  }

  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) {
    return { error: "Checkout is not configured yet." }
  }

  // Find existing Stripe customer or create a new one
  const existing = await stripe.customers.search({
    query: `email:"${email}"`,
    limit: 1,
  })

  const customer =
    existing.data[0] ??
    (await stripe.customers.create({ email, phone }))

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "payment",
    billing_address_collection: "required",
    metadata: { phone, customer_email: email },
    success_url: `${origin}/success`,
    cancel_url: `${origin}/`,
  })

  redirect(session.url!)
}
