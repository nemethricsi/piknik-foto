create type booking_status as enum ('booked', 'cancelled', 'refunded', 'completed');

alter table booking
  add column status booking_status not null default 'booked';
