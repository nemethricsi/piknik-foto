'use server';

import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';

type State = { error: string | null };

export async function createCheckout(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const email = formData.get('email')?.toString().trim();
  const slotId = formData.get('time_slot_id')?.toString();

  if (!email) {
    return { error: 'Email-cím megadása kötelező.' };
  }

  if (!slotId) {
    return { error: 'Nincs kiválasztott időpont.' };
  }

  // Re-validate the slot is still available
  const supabase = createServiceClient();
  const { data: slot } = await supabase
    .from('time_slot')
    .select('id, revealed, booking_id')
    .eq('id', slotId)
    .single();

  if (!slot || !slot.revealed || slot.booking_id !== null) {
    return {
      error: 'Ez az időpont már nem elérhető. Kérjük, válassz másikat.',
    };
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return { error: 'A foglalási rendszer nincs beállítva.' };
  }

  // Find existing Stripe customer or create a new one
  const existing = await stripe.customers.search({
    query: `email:"${email}"`,
    limit: 1,
  });

  const customer =
    existing.data[0] ?? (await stripe.customers.create({ email }));

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    billing_address_collection: 'required',
    customer_update: { address: 'auto' },
    phone_number_collection: { enabled: true },
    metadata: { customer_email: email, time_slot_id: slotId },
    success_url: `${origin}/success`,
    cancel_url: `${origin}/`,
  });

  redirect(session.url!);
}
