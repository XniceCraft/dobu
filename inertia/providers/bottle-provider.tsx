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

export function BottleProvider({ children }: { children: React.ReactNode }) {
  const { user } = usePage<InertiaProps>().props
  const [bottle, setBottle] = useState<Bottle | null>(null)
  const { connected, connect, send, sendNoWait, addIncomingCallback, removeIncomingCallback } =
    useBLE()

  const onConnectHandler = useCallback(async () => {
    try {
      const remainingMl = await send('VOLUME')
      setBottle({ size: 400, remainingMl: Number.parseInt(remainingMl.split(':')[1]) })
    } catch {
      toast.error('timeout')
    }
  }, [send])

  const connectWrapper = useCallback(async () => {
    const result = await connect()
    if (result.success) {
      toast.success('Terhubung')
      await onConnectHandler()
    }
  }, [connect, onConnectHandler])

  const onIncomingMessage = useCallback(
    async (message: string) => {
      if (message.startsWith('REQUEST_SYNC')) {
        if (!user) return

        const drinkCount = Math.floor(
          (new Date(user.dayEnd).getTime() - new Date(user.dayStart).getTime()) /
            user.intervalMinutes
        )
        const targetPerInterval = user.milliliterTarget / drinkCount
        await sendNoWait(
          `SYNC:${user.milliliterTarget}:${targetPerInterval}:${user.intervalMinutes}:${drinkCount}`
        )
      }
    },
    [sendNoWait, user]
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
