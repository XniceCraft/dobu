/// <reference types="@types/web-bluetooth" />
import { useRef, useState, useCallback } from 'react'

const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc'
const WRITE_CHAR_UUID = '12345678-1234-1234-1234-123456789001' // PWA → ESP32
const NOTIFY_CHAR_UUID = '12345678-1234-1234-1234-123456789002' // ESP32 → PWA

type ConnectResult =
  | { success: true }
  | {
      success: false
      error: string
    }

export function useBLE() {
  const [connected, setConnected] = useState(false)
  const [incoming, setIncoming] = useState<string>('')
  const writeCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)

  const connect = useCallback(async (): Promise<ConnectResult> => {
    if (!navigator.bluetooth)
      return { success: false, error: 'Bluetooth is not supported on this device.' }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
      })

      device.addEventListener('gattserverdisconnected', () => setConnected(false))

      const server = await device.gatt!.connect()
      const service = await server.getPrimaryService(SERVICE_UUID)

      writeCharRef.current = await service.getCharacteristic(WRITE_CHAR_UUID)

      const notifyChar = await service.getCharacteristic(NOTIFY_CHAR_UUID)
      await notifyChar.startNotifications()
      notifyChar.addEventListener('characteristicvaluechanged', (e) => {
        const val = (e.target as BluetoothRemoteGATTCharacteristic).value!
        setIncoming(new TextDecoder().decode(val))
      })

      setConnected(true)
    } catch {
      return { success: false, error: 'Bluetooth is not supported on this device.' }
    }

    return { success: true }
  }, [])

  const send = useCallback(async (message: string) => {
    if (!writeCharRef.current) return
    const encoded = new TextEncoder().encode(message)
    await writeCharRef.current.writeValueWithResponse(encoded)
  }, [])

  return { connect, send, incoming, connected }
}
