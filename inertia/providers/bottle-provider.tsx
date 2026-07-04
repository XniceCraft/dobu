import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { useBLE } from '@/hooks/use-ble'
import { usePage } from '@inertiajs/react'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'
import { useRouter } from '@adonisjs/inertia/react'

type Bottle = {
  size: 400
  remainingMl: number
}

type BottleContextType = {
  bottle: Bottle | null
  connect: () => void
  connected: boolean
  send: (cmd: string, payload?: string) => Promise<void>
  initalizeData: () => Promise<void>
}

const BottleContext = createContext<BottleContextType | null>(null)

function timeToMinutes(time: string): number {
  const [h, m, s] = time.split(':').map(Number)
  return h * 60 + m + s / 60
}

export function BottleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = usePage<InertiaProps>().props
  const [bottle, setBottle] = useState<Bottle | null>(null)
  const { connected, connect, send, sendNoWait, addIncomingCallback, removeIncomingCallback } =
    useBLE()

  const initalizeData = useCallback(async () => {
    const remainingMl = await send('VOLUME')

    setBottle({ size: 400, remainingMl: Number.parseInt(remainingMl.split(':')[1]) })
  }, [send])

  const connectWrapper = useCallback(async () => {
    const result = await connect()
    if (!result.success) {
      toast.error('Gagal terhubung')
      return
    }
    toast.success('Berhasil terhubung')
    await initalizeData()
  }, [connect, initalizeData])

  const onIncomingMessage = useCallback(
    async (message: string) => {
      if (message.startsWith('DRINK')) {
        if (!user) return

        const ml = Number.parseInt(message.split(':')[1])
        setBottle((old) => (old ? { ...old, remainingMl: ml } : null))

        router.visit(
          {
            route: 'drink.store',
          },
          {
            method: 'post',
            data: { amount: ml },
            preserveState: true,
            onError: () => {
              toast.error('Gagal mencatat')
            },
            onSuccess: () => {
              toast.success('Berhasil mencatat')
            },
          }
        )
      } else if (message.startsWith('REQUEST_SYNC_ALL')) {
        if (!user) return

        const startMinutes = timeToMinutes(user.dayStart)
        const endMinutes = timeToMinutes(user.dayEnd)
        const duration = endMinutes - startMinutes
        const drinkCount = Math.floor(duration / user.intervalMinutes)
        const targetPerInterval = Math.floor(user.milliliterTarget / drinkCount)
        await sendNoWait(
          `SYNC:${user.milliliterTarget}:${targetPerInterval}:${user.intervalMinutes}:${drinkCount}`
        )
      }
    },
    [user, router, sendNoWait]
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
      initalizeData,
    }),
    [bottle, connectWrapper, connected, sendNoWait, initalizeData]
  )

  return <BottleContext value={value}>{children}</BottleContext>
}

export function useBottle() {
  const ctx = use(BottleContext)
  if (!ctx) throw new Error('useBLEContext must be used within BLEProvider')

  return ctx
}
