import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { useBLE } from '@/hooks/use-ble'
import { useAsRef } from '@/hooks/use-as-ref'
import { usePage } from '@inertiajs/react'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'
import { useRouter } from '@adonisjs/inertia/react'

const BOTTLE_CAPACITY_ML = 400

type Bottle = {
  size: number
  remainingMl: number
}

type BottleContextType = {
  bottle: Bottle | null
  connected: boolean
  connect: () => void
  send: (cmd: string, payload?: string) => Promise<string>
  sendNoWait: (cmd: string, payload?: string) => Promise<void>
  initializeData: () => Promise<void>
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
  const { connected, connect, send, sendNoWait, subscribe, subscribeDisconnect } = useBLE()

  const userRef = useAsRef(user)
  const routerRef = useAsRef(router)
  const sendNoWaitRef = useAsRef(sendNoWait)

  const initializeData = useCallback(async () => {
    const remainingMl = await send('VOLUME')
    setBottle({ size: BOTTLE_CAPACITY_ML, remainingMl: Number.parseInt(remainingMl.split(':')[1]) })
  }, [send])

  const connectWrapper = useCallback(async () => {
    const result = await connect()
    if (!result.success) {
      toast.error('Gagal terhubung')
      return
    }
    toast.success('Berhasil terhubung')
    await initializeData()

    try {
      const response = await fetch('/drink/device/sync')
      if (response.ok) {
        const data = await response.json()
        const delta = data.delta
        if (delta > 0) {
          await sendNoWait('REQUEST_SYNC_DRINK', String(delta))
        }
      }
    } catch {
      toast.error('Gagal sinkronisasi minum')
    }
  }, [connect, initializeData, sendNoWait])

  const onIncomingMessage = useCallback(async (message: string) => {
    if (message.startsWith('DRINK')) {
      const user = userRef.current
      if (!user) return

      const ml = Number.parseInt(message.split(':')[1])
      setBottle((old) => (old ? { ...old, remainingMl: ml } : null))

      routerRef.current.visit(
        { route: 'drink.store' },
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
      const user = userRef.current
      if (!user) return

      const startMinutes = timeToMinutes(user.dayStart)
      const endMinutes = timeToMinutes(user.dayEnd)
      const duration = endMinutes - startMinutes
      const drinkCount = Math.floor(duration / user.intervalMinutes)
      const targetPerInterval = Math.floor(user.milliliterTarget / drinkCount)

      try {
        await sendNoWaitRef.current(
          `SYNC:${user.milliliterTarget}:${targetPerInterval}:${user.intervalMinutes}:${drinkCount}`
        )
      } catch {
        toast.error('Gagal sinkronisasi')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDisconnect = useCallback(() => {
    routerRef.current.visit(
      { route: 'drink.device.disconnect' },
      {
        method: 'post',
        preserveState: true,
        preserveScroll: true,
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const unsubscribeIncoming = subscribe(onIncomingMessage)
    const unsubscribeDisconnect = subscribeDisconnect(onDisconnect)

    return () => {
      unsubscribeIncoming()
      unsubscribeDisconnect()
    }
  }, [subscribe, subscribeDisconnect, onIncomingMessage, onDisconnect])

  const sendNoWaitWrapped = useCallback(
    async (cmd: string, payload?: string): Promise<void> => {
      try {
        await sendNoWait(cmd, payload)
      } catch {
        toast.error('Gagal mengirim perintah')
      }
    },
    [sendNoWait]
  )

  const value = useMemo(
    () => ({
      bottle,
      connect: connectWrapper,
      connected,
      send,
      sendNoWait: sendNoWaitWrapped,
      initializeData,
    }),
    [bottle, connectWrapper, connected, send, sendNoWaitWrapped, initializeData]
  )

  return <BottleContext value={value}>{children}</BottleContext>
}

export function useBottle() {
  const ctx = use(BottleContext)
  if (!ctx) throw new Error('useBottle must be used within BottleProvider')

  return ctx
}
