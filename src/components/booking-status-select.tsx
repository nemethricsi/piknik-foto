"use client"

import { useOptimistic, useTransition } from "react"
import { updateBookingStatus } from "@/actions/update-booking-status"

type Status = "booked" | "completed" | "cancelled" | "refunded"

const labels: Record<Status, string> = {
  booked: "Booked",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
}

export function BookingStatusSelect({ id, status }: { id: string; status: Status }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status)
  const [, startTransition] = useTransition()

  const editable = optimisticStatus === "booked" || optimisticStatus === "completed"

  if (!editable) {
    return (
      <span className="text-sm text-muted-foreground">{labels[optimisticStatus]}</span>
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as "booked" | "completed"
    const formData = new FormData()
    formData.set("id", id)
    formData.set("status", newStatus)

    startTransition(async () => {
      setOptimisticStatus(newStatus)
      await updateBookingStatus(formData)
    })
  }

  return (
    <select
      value={optimisticStatus}
      onChange={handleChange}
      className="rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
    >
      <option value="booked">Booked</option>
      <option value="completed">Completed</option>
    </select>
  )
}
