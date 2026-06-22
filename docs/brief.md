# Photo shooting business database app

The goal is to create a simple app that can help to oragnize our photoshooting.
Until now all the organization went into one Google Spreadsheet.

## The main flow

The user would visit the home page as the main landing page of the site. `/`
There they will found a form where they can "book" a time slot.
What should happen after they submit this form?
They should be redirected to a Stripe Checkout session and pay something, details
later.

We will connect a Supabase project and we will save data to our database.

## Main tables (planned):

_Customer_

| name          | type   |
| ------------- | ------ |
| id            | string |
| email         | string |
| phone_number  | string |
| first_name    | string |
| last_name     | string |
| stripe_id     | string |
| mailerlite_id | string |

_Booking_

| name                  | type   |
| --------------------- | ------ |
| id                    | string |
| start_time            | date   |
| end_time              | date   |
| customer_id           | string |
| stripe_payment_intent | string |

_Product_

| name              | type   |
| ----------------- | ------ |
| id                | string |
| name              | string |
| stripe_product_id | string |

_Time_slot_

| name       | type    |
| ---------- | ------- |
| id         | string  |
| start_time | date    |
| end_time   | date    |
| revealed   | boolean |
| booking_id | string? |

The Time slots would be pre-defined and pre-seeded slots that admins could control. Customers
only could book if a time slot is available.

When a customer submits a form and pays, then a Booking is created and attached to the time slot.
A time slot is available if `revealed` is `true`, AND `booking_id` is `null`.

## The `/admin` page

There should be an authenticated `/admin` page.
Authentication can be achieved via Supabase. Only a few admins expected now.
Simple username/password, or email/password.

He we will create a dashboard for viewing the bookings, etc.

## Tech stack (plan)

- Next.js
- Tailwind
- Supabase
- Shadcn
- Drizzle ORM (if needed)
- Stripe
- Mailerlite
