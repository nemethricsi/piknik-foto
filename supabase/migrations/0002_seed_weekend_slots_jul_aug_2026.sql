-- Seed 1-hour time slots for every weekend day in July and August 2026
-- Hours: 09:00–17:00 local time (Europe/Budapest, CEST = UTC+2 in summer)
-- Skips any slot whose start_time already exists to avoid duplicates

INSERT INTO time_slot (start_time, end_time, revealed)
SELECT
  slot_local AT TIME ZONE 'Europe/Budapest',
  (slot_local + interval '1 hour') AT TIME ZONE 'Europe/Budapest',
  false
FROM (
  SELECT
    (d::date + (h || ' hours')::interval)::timestamp AS slot_local
  FROM
    generate_series('2026-07-01'::date, '2026-08-31'::date, '1 day'::interval) AS d,
    generate_series(9, 16) AS h  -- 9→10, 10→11, ..., 16→17
  WHERE
    EXTRACT(ISODOW FROM d) IN (6, 7)  -- 6 = Saturday, 7 = Sunday
) slots
WHERE NOT EXISTS (
  SELECT 1 FROM time_slot ts
  WHERE ts.start_time = slot_local AT TIME ZONE 'Europe/Budapest'
);
