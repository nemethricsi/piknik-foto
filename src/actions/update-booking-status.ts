"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"

export async function updateBookingStatus(formData: FormData) {
  const id = formData.get("id")?.toString()
  const status = formData.get("status")?.toString()

  if (!id || (status !== "booked" && status !== "completed")) return

  const supabase = createServiceClient()
  await supabase.from("booking").update({ status }).eq("id", id)

  revalidatePath("/admin")
}
