/// <reference types="@types/web-bluetooth" />
import { useRef, useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

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
  const deviceRef = useRef<BluetoothDevice | null>(null)
  const notifyCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const writeCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const onIncomingMessageCallbackRef = useRef<(message: string) => void | null>(null)

  const onGattDisconnect = useCallback(() => {
    setConnected(false)
  }, [])

  const onIncomingMessage = useCallback((e: Event) => {
    const val = (e.target as BluetoothRemoteGATTCharacteristic).value!
    const message = new TextDecoder().decode(val)
    setIncoming(message)
    onIncomingMessageCallbackRef.current?.(message)
  }, [])

  const addIncomingCallback = useCallback((callback: (message: string) => void) => {
    onIncomingMessageCallbackRef.current = callback
  }, [])

  const removeIncomingCallback = useCallback(() => {
    onIncomingMessageCallbackRef.current = null
  }, [])

  const teardown = useCallback(() => {
    const device = deviceRef.current
    const notifyChar = notifyCharRef.current

    if (notifyChar) {
      notifyChar.removeEventListener('characteristicvaluechanged', onIncomingMessage)
      if (device?.gatt?.connected) {
        notifyChar.stopNotifications()
      }
    }

    if (device) {
      device.removeEventListener('gattserverdisconnected', onGattDisconnect)
      if (device.gatt?.connected) {
        device.gatt.disconnect()
      }
    }

    deviceRef.current = null
    notifyCharRef.current = null
    writeCharRef.current = null
  }, [onGattDisconnect, onIncomingMessage])

  useEffect(() => {
    return () => {
      teardown()
    }
  }, [teardown])

  const connect = useCallback(
    async ({ onConnect }: { onConnect?: () => void }): Promise<ConnectResult> => {
      if (!navigator.bluetooth)
        return { success: false, error: 'Bluetooth is not supported on this device.' }

      try {
        deviceRef.current = await navigator.bluetooth.requestDevice({
          filters: [{ services: [SERVICE_UUID] }],
        })

        deviceRef.current.addEventListener('gattserverdisconnected', onGattDisconnect)

        const server = await deviceRef.current.gatt!.connect()
        const service = await server.getPrimaryService(SERVICE_UUID)

        writeCharRef.current = await service.getCharacteristic(WRITE_CHAR_UUID)
        notifyCharRef.current = await service.getCharacteristic(NOTIFY_CHAR_UUID)
        await notifyCharRef.current.startNotifications()
        notifyCharRef.current.addEventListener('characteristicvaluechanged', onIncomingMessage)

        setConnected(true)
        await onConnect?.()
      } catch {
        return { success: false, error: 'Bluetooth is not supported on this device.' }
      }

      return { success: true }
    },
    [onGattDisconnect, onIncomingMessage]
  )

  const send = useCallback(async (message: string) => {
    if (!writeCharRef.current || !deviceRef.current?.gatt?.connected) return

    try {
      const encoded = new TextEncoder().encode(message)
      await writeCharRef.current.writeValueWithResponse(encoded)
    } catch {
      toast.error('Failed to send message')
    }
  }, [])

  return { connect, send, incoming, connected, addIncomingCallback, removeIncomingCallback }
}
