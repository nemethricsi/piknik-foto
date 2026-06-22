import { createServiceClient } from "@/lib/supabase/server"
import { TimeSlotList, groupSlotsByDay } from "@/components/time-slot-list"
import type { TimeSlot } from "@/components/time-slot-list"

export default async function Home() {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("time_slot")
    .select("id, start_time, end_time, revealed, booking_id")
    .order("start_time", { ascending: true })

  const days = groupSlotsByDay((data ?? []) as TimeSlot[])

  return (
    <main className="flex min-h-screen flex-col items-center p-6 py-12">
      <TimeSlotList days={days} />
    </main>
  )
}
