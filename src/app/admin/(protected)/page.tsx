import { createServiceClient } from "@/lib/supabase/server"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Booking = {
  id: string
  created_at: string
  stripe_payment_intent: string | null
  customer: {
    email: string
    phone_number: string | null
    first_name: string | null
    last_name: string | null
  } | null
}

export default async function AdminPage() {
  const supabase = createServiceClient()

  const { data: bookings } = await supabase
    .from("booking")
    .select("id, created_at, stripe_payment_intent, customer(email, phone_number, first_name, last_name)")
    .order("created_at", { ascending: false })

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Bookings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booked at</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Payment intent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(bookings as Booking[] | null)?.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="whitespace-nowrap">
                {new Date(b.created_at).toLocaleString("hu-HU")}
              </TableCell>
              <TableCell>
                {[b.customer?.first_name, b.customer?.last_name]
                  .filter(Boolean)
                  .join(" ") || "—"}
              </TableCell>
              <TableCell>{b.customer?.email ?? "—"}</TableCell>
              <TableCell>{b.customer?.phone_number ?? "—"}</TableCell>
              <TableCell className="font-mono text-xs">
                {b.stripe_payment_intent ?? "—"}
              </TableCell>
            </TableRow>
          ))}
          {(!bookings || bookings.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No bookings yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  )
}
