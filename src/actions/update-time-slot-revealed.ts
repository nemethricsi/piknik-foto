'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'

export async function updateTimeSlotRevealed(id: string, revealed: boolean) {
  const supabase = createServiceClient()
  await supabase.from('time_slot').update({ revealed }).eq('id', id)
  revalidatePath('/admin/time-slots')
}
