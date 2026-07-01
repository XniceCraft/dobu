import { createContext, use } from 'react'
import { useBLE } from '@/hooks/use-ble'

type BottleContextType = ReturnType<typeof useBLE>

const BottleContext = createContext<BottleContextType | null>(null)

export function BottleProvider({ children }: { children: React.ReactNode }) {
  const ble = useBLE()

  return <BottleContext value={ble}>{children}</BottleContext>
}

export function useBottle() {
  const ctx = use(BottleContext)
  if (!ctx) throw new Error('useBLEContext must be used within BLEProvider')

  return ctx
}
