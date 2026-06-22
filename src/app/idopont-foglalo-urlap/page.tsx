import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/booking-form';

function formatSelectedTime(dateStr: string): string {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('hu-HU', {
    timeZone: 'Europe/Budapest',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const time = d.toLocaleTimeString('hu-HU', {
    timeZone: 'Europe/Budapest',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}

export default async function FoglalasPage({
  searchParams,
}: {
  searchParams: Promise<{ slot?: string }>;
}) {
  const { slot } = await searchParams;

  if (!slot) redirect('/');

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('time_slot')
    .select('id, start_time, revealed, booking_id')
    .eq('id', slot)
    .single();

  if (!data || !data.revealed || data.booking_id !== null) redirect('/');

  const selectedTime = formatSelectedTime(data.start_time);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Foglalás</CardTitle>
          <CardDescription className="font-medium text-foreground">
            {selectedTime}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <BookingForm slotId={slot} />
          <Button variant="outline" asChild>
            <Link href="/">Vissza a főoldalra</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
