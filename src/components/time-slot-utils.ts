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
