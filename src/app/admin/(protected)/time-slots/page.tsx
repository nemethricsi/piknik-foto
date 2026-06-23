import { createServiceClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RevealedSwitch } from '@/components/revealed-switch'

type TimeSlot = {
  id: string
  start_time: string
  revealed: boolean
  booking: {
    customer: {
      first_name: string | null
      last_name: string | null
    } | null
  } | null
}

function groupByDay(slots: TimeSlot[]) {
  const map = new Map<string, TimeSlot[]>()
  for (const slot of slots) {
    const key = new Date(slot.start_time).toLocaleDateString('sv-SE', {
      timeZone: 'Europe/Budapest',
    })
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(slot)
  }
  return Array.from(map.entries()).map(([key, s]) => ({
    key,
    heading: new Date(s[0].start_time).toLocaleDateString('hu-HU', {
      timeZone: 'Europe/Budapest',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
    slots: s,
  }))
}

export default async function TimeSlotsPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('time_slot')
    .select('id, start_time, revealed, booking(customer(first_name, last_name))')
    .order('start_time', { ascending: true })

  const days = groupByDay((data as TimeSlot[] | null) ?? [])

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-semibold">Időpontok</h1>
      {days.length === 0 && (
        <p className="text-sm text-muted-foreground">Nincsenek időpontok.</p>
      )}
      <div className="flex flex-col gap-6">
        {days.map(({ key, heading, slots }) => (
          <div key={key}>
            <h2 className="mb-2 text-base font-semibold capitalize">{heading}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Időpont</TableHead>
                  <TableHead>Foglalás</TableHead>
                  <TableHead>Megjelenít</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(slot.start_time).toLocaleTimeString('hu-HU', {
                        timeZone: 'Europe/Budapest',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell>
                      {slot.booking?.customer
                        ? `${slot.booking.customer.last_name ?? ''} ${slot.booking.customer.first_name ?? ''}`.trim()
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <RevealedSwitch
                        id={slot.id}
                        revealed={slot.revealed}
                        disabled={slot.booking !== null}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  )
}
