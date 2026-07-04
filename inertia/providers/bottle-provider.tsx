import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { useBLE } from '@/hooks/use-ble'
import { usePage } from '@inertiajs/react'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'

type Bottle = {
  size: 400
  remainingMl: number
}

type BottleContextType = {
  bottle: Bottle | null
  connect: () => void
  connected: boolean
  send: (cmd: string, payload?: string) => Promise<void>
}

const BottleContext = createContext<BottleContextType | null>(null)

function timeToMinutes(time: string): number {
  const [h, m, s] = time.split(':').map(Number)
  return h * 60 + m + s / 60
}

export function BottleProvider({ children }: { children: React.ReactNode }) {
  const { user } = usePage<InertiaProps>().props
  const [bottle, setBottle] = useState<Bottle | null>(null)
  const { connected, connect, send, sendNoWait, addIncomingCallback, removeIncomingCallback } =
    useBLE()

  const onConnectHandler = useCallback(async () => {
    try {
      if (!user) return
      const remainingMl = await send('VOLUME')

      const startMinutes = timeToMinutes(user.dayStart)
      const endMinutes = timeToMinutes(user.dayEnd)
      const duration = endMinutes - startMinutes
      const drinkCount = Math.floor(duration / user.intervalMinutes)
      const targetPerInterval = Math.floor(user.milliliterTarget / drinkCount)
      await sendNoWait(
        `SYNC:${user.milliliterTarget}:${targetPerInterval}:${user.intervalMinutes}:${drinkCount}`
      )
      setBottle({ size: 400, remainingMl: Number.parseInt(remainingMl.split(':')[1]) })
    } catch {
      toast.error('timeout')
    }
  }, [user, send, sendNoWait])

  const connectWrapper = useCallback(async () => {
    const result = await connect()
    if (result.success) {
      toast.success('Terhubung')
      await onConnectHandler()
    }
  }, [connect, onConnectHandler])

  const onIncomingMessage = useCallback(
    async (message: string) => {
      console.log(message)
      if (message.startsWith('REQUEST_SYNC')) {
      }
      if (message.startsWith('DRINK')) {
        if (!user) return

        const ml = Number.parseInt(message.split(':')[1])
        setBottle((old) => (old ? { ...old, remainingMl: ml } : null))
      }
    },
    [user]
  )

  useEffect(() => {
    addIncomingCallback(onIncomingMessage)

    return () => {
      removeIncomingCallback()
    }
  }, [addIncomingCallback, onIncomingMessage, removeIncomingCallback])

  const value = useMemo(
    () => ({
      bottle,
      connect: connectWrapper,
      connected,
      send: sendNoWait,
    }),
    [bottle, connectWrapper, connected, sendNoWait]
  )

  return <BottleContext value={value}>{children}</BottleContext>
}

export function useBottle() {
  const ctx = use(BottleContext)
  if (!ctx) throw new Error('useBLEContext must be used within BLEProvider')

  return ctx
}
