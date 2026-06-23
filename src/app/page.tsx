import Link from 'next/link';
import { createServiceClient, createClient } from '@/lib/supabase/server';
import { TimeSlotList, groupSlotsByDay } from '@/components/time-slot-list';
import type { TimeSlot } from '@/components/time-slot-list';

export default async function Home() {
  const supabase = createServiceClient();
  const authClient = await createClient();

  const [
    { data },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from('time_slot')
      .select('id, start_time, end_time, revealed, booking_id')
      .order('start_time', { ascending: true }),
    authClient.auth.getUser(),
  ]);

  const days = groupSlotsByDay((data ?? []) as TimeSlot[]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 py-12">
      <TimeSlotList days={days} />
      {user && (
        <Link
          href="/admin"
          className="fixed bottom-6 right-6 rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        >
          Admin
        </Link>
      )}
    </main>
  );
}
