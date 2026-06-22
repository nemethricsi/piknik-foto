import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Booking confirmed!</CardTitle>
          <CardDescription>
            Thank you for your payment. We&apos;ll be in touch with the details.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </main>
  )
}
