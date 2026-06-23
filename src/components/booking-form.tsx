'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCheckout } from '@/actions/create-checkout';

const initialState = { error: null as string | null };

export function BookingForm({ slotId }: { slotId: string }) {
  const [state, action, pending] = useActionState(createCheckout, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="time_slot_id" value={slotId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email-cím</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="pelda@gmail.com"
          autoComplete="email"
          autoFocus
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'Átirányítás…' : 'Foglalás'}
      </Button>
    </form>
  );
}
