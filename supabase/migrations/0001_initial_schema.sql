-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Customers
create table customer (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  phone_number  text,
  first_name    text,
  last_name     text,
  stripe_id     text unique,
  mailerlite_id text,
  created_at    timestamptz not null default now()
);

-- Products
create table product (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  stripe_product_id text unique,
  created_at        timestamptz not null default now()
);

-- Time slots (pre-seeded by admins)
create table time_slot (
  id         uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  end_time   timestamptz not null,
  revealed   boolean not null default false,
  booking_id uuid,
  created_at timestamptz not null default now()
);

-- Bookings
create table booking (
  id                    uuid primary key default gen_random_uuid(),
  start_time            timestamptz,
  end_time              timestamptz,
  customer_id           uuid references customer(id) on delete set null,
  stripe_payment_intent text,
  created_at            timestamptz not null default now()
);

-- Foreign key from time_slot.booking_id → booking.id (after booking table exists)
alter table time_slot
  add constraint fk_time_slot_booking
  foreign key (booking_id) references booking(id) on delete set null;

-- Row Level Security
alter table customer  enable row level security;
alter table product   enable row level security;
alter table time_slot enable row level security;
alter table booking   enable row level security;

-- Public can read revealed, unbooked time slots (for the booking form)
create policy "public read available time slots"
  on time_slot for select
  using (revealed = true);

-- All other access (insert/update/delete) is service-role only (bypasses RLS)
