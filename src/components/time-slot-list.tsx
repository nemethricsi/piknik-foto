import Link from 'next/link';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  revealed: boolean;
  booking_id: string | null;
};

export type DayGroup = {
  dateKey: string;
  heading: string;
  slots: TimeSlot[];
};

function formatHeading(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('hu-HU', {
    timeZone: 'Europe/Budapest',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function formatSlotTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('hu-HU', {
    timeZone: 'Europe/Budapest',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isAvailable(slot: TimeSlot): boolean {
  return slot.revealed && slot.booking_id === null;
}

export function groupSlotsByDay(slots: TimeSlot[]): DayGroup[] {
  const map = new Map<string, TimeSlot[]>();

  for (const slot of slots) {
    const d = new Date(slot.start_time);
    const dateKey = d.toLocaleDateString('sv-SE', {
      timeZone: 'Europe/Budapest',
    }); // YYYY-MM-DD
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(slot);
  }

  return Array.from(map.entries())
    .slice(0, 4)
    .map(([dateKey, daySlots]) => ({
      dateKey,
      heading: formatHeading(daySlots[0].start_time),
      slots: daySlots,
    }));
}

export function TimeSlotList({ days }: { days: DayGroup[] }) {
  if (days.length === 0) return null;

  return (
    <section className="w-full max-w-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Időpont lista</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Így tudsz foglalni: klikk a{' '}
          <span className="font-semibold text-emerald-600">SZABAD</span>{' '}
          feliratra
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {days.map((day, i) => (
          <details
            key={day.dateKey}
            className="group rounded-lg border border-border bg-white"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold capitalize select-none text-base hover:bg-muted/50">
              {day.heading}
              <svg
                className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <Table>
              <TableBody>
                {day.slots.map((slot) => {
                  const available = isAvailable(slot);
                  return (
                    <TableRow key={slot.id}>
                      <TableCell className="font-medium">
                        {formatSlotTime(slot.start_time)}
                      </TableCell>
                      <TableCell className="text-right">
                        {available ? (
                          <Link
                            href={`/idopont-foglalo-urlap?slot=${slot.id}`}
                            className="font-bold text-emerald-600 hover:underline"
                          >
                            SZABAD
                          </Link>
                        ) : (
                          <span className="cursor-not-allowed font-bold text-red-500">
                            NEM ELÉRHETŐ
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </details>
        ))}
      </div>
    </section>
  );
}
