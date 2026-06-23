'use client'

import { useOptimistic, useTransition } from 'react'
import { updateTimeSlotRevealed } from '@/actions/update-time-slot-revealed'

export function RevealedSwitch({
  id,
  revealed,
  disabled,
}: {
  id: string
  revealed: boolean
  disabled: boolean
}) {
  const [optimistic, setOptimistic] = useOptimistic(revealed)
  const [, startTransition] = useTransition()

  function toggle() {
    const next = !optimistic
    startTransition(async () => {
      setOptimistic(next)
      await updateTimeSlotRevealed(id, next)
    })
  }

  return (
    <button
      role="switch"
      aria-checked={optimistic}
      disabled={disabled}
      onClick={toggle}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${optimistic ? 'bg-primary' : 'bg-input'}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-background shadow transition-transform ${optimistic ? 'translate-x-4' : 'translate-x-1'}`}
      />
    </button>
  )
}
