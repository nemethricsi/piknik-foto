ALTER TABLE booking
  ADD CONSTRAINT booking_stripe_payment_intent_unique
  UNIQUE (stripe_payment_intent);
