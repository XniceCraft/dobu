import { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from '@adonisjs/inertia/react'
import { useBLE } from '@/hooks/use-ble'
import toast from 'react-hot-toast'

const BOTTLE_CAPACITY_ML = 400

type ConnectParams = {
  delta: number
  targetMl: number
  intervalMinutes: number
  drinkCount: number
  targetPerInterval: number
}

type Bottle = {
  size: number
  remainingMl: number
}

type BottleContextType = {
  bottle: Bottle | null
  connected: boolean
  connect: (data: ConnectParams) => void
  send: (cmd: string, payload?: string) => Promise<string>
  sendNoWait: (cmd: string, payload?: string) => Promise<void>
  initializeData: () => Promise<void>
}

const BottleContext = createContext<BottleContextType | null>(null)

export function BottleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [bottle, setBottle] = useState<Bottle | null>(null)
  const { connected, connect, send, sendNoWait, subscribe, subscribeDisconnect } = useBLE()

  const dataRef = useRef<ConnectParams | null>(null)

  const initializeData = useCallback(async () => {
    const remainingMl = await send('VOLUME')
    setBottle({ size: BOTTLE_CAPACITY_ML, remainingMl: Number.parseInt(remainingMl.split(':')[1]) })
  }, [send])

  const connectWrapper = useCallback(
    async (data: ConnectParams) => {
      dataRef.current = data

      const result = await connect()
      if (!result.success) {
        toast.error('Gagal terhubung')
        return
      }

      toast.success('Berhasil terhubung')
      await initializeData()

      if (data.delta > 0) {
        await sendNoWait('REQUEST_SYNC_DRINK', String(data.delta))
      }
    },
    [connect, initializeData, sendNoWait]
  )

  const onIncomingMessage = useCallback(
    async (message: string) => {
      if (message.startsWith('DRINK')) {
        const ml = Number.parseInt(message.split(':')[1])
        setBottle((old) => (old ? { ...old, remainingMl: ml } : null))

        router.visit(
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
        try {
          await sendNoWait(
            `SYNC:${dataRef.current!.targetMl}:${dataRef.current!.targetPerInterval}:${dataRef.current!.intervalMinutes}:${dataRef.current!.drinkCount}`
          )
        } catch {
          toast.error('Gagal sinkronisasi')
        }
      }
    },
    [router, sendNoWait]
  )

  const onDisconnect = useCallback(() => {
    router.visit(
      { route: 'drink.device.disconnect' },
      {
        method: 'post',
        preserveState: true,
        preserveScroll: true,
      }
    )
  }, [router])

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
