/// <reference types="@types/web-bluetooth" />
import { useRef, useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc'
const WRITE_CHAR_UUID = '12345678-1234-1234-1234-123456789001' // PWA → ESP32
const NOTIFY_CHAR_UUID = '12345678-1234-1234-1234-123456789002' // ESP32 → PWA

const PREFIX_DELIMITER = ':'

type ConnectResult =
  | { success: true }
  | {
      success: false
      error: string
    }

type PendingRequest = {
  resolve: (message: string) => void
  reject: (reason: Error) => void
  timeoutId: ReturnType<typeof setTimeout>
}

function extractPrefix(message: string): string {
  const idx = message.indexOf(PREFIX_DELIMITER)
  return idx === -1 ? message : message.slice(0, idx)
}

function buildMessage(cmd: string, payload?: string): string {
  return payload === undefined ? cmd : `${cmd}${PREFIX_DELIMITER}${payload}`
}

export function useBLE() {
  const [connected, setConnected] = useState(false)
  const deviceRef = useRef<BluetoothDevice | null>(null)
  const notifyCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const writeCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const onIncomingMessageCallbackRef = useRef<(message: string) => void | null>(null)
  const pendingRef = useRef<Map<string, PendingRequest>>(new Map())

  const rejectAllPending = useCallback((reason: Error) => {
    for (const pending of pendingRef.current.values()) {
      clearTimeout(pending.timeoutId)
      pending.reject(reason)
    }
    pendingRef.current.clear()
  }, [])

  const onGattDisconnect = useCallback(() => {
    setConnected(false)
    rejectAllPending(new Error('Device disconnected'))
  }, [rejectAllPending])

  const onIncomingMessage = useCallback((e: Event) => {
    const val = (e.target as BluetoothRemoteGATTCharacteristic).value!
    const message = new TextDecoder().decode(val)
    onIncomingMessageCallbackRef.current?.(message)

    const prefix = extractPrefix(message)
    const pending = pendingRef.current.get(prefix)
    if (pending) {
      clearTimeout(pending.timeoutId)
      pending.resolve(message)
      pendingRef.current.delete(prefix)
    }
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

    rejectAllPending(new Error('Connection closed'))

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
  }, [onGattDisconnect, onIncomingMessage, rejectAllPending])

  useEffect(() => {
    return () => {
      teardown()
    }
  }, [teardown])

  const connect = useCallback(async (): Promise<ConnectResult> => {
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
    } catch {
      return { success: false, error: 'Bluetooth is not supported on this device.' }
    }

    return { success: true }
  }, [onGattDisconnect, onIncomingMessage])

  /**
   * Sends `cmd` (optionally with a payload, joined by PREFIX_DELIMITER)
   * and resolves with the next incoming message sharing that same
   * cmd prefix. Rejects on write failure, disconnect, or timeout.
   * Different cmds can be in flight concurrently; sending the same
   * cmd twice before the first resolves rejects the new call.
   *
   * send('STATUS')            -> writes "STATUS"
   * send('STATUS', 'ping')    -> writes "STATUS:ping"
   */
  const send = useCallback((cmd: string, payload?: string, timeoutMs = 5000): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!writeCharRef.current || !deviceRef.current?.gatt?.connected) {
        reject(new Error('Not connected'))
        return
      }

      if (pendingRef.current.has(cmd)) {
        reject(new Error(`A request with prefix "${cmd}" is already in flight`))
        return
      }

      const timeoutId = setTimeout(() => {
        pendingRef.current.delete(cmd)
        reject(new Error(`Timed out waiting for response to "${cmd}"`))
      }, timeoutMs)

      pendingRef.current.set(cmd, { resolve, reject, timeoutId })

      const message = buildMessage(cmd, payload)
      const encoded = new TextEncoder().encode(message)
      writeCharRef.current.writeValueWithResponse(encoded).catch((err: unknown) => {
        clearTimeout(timeoutId)
        pendingRef.current.delete(cmd)
        reject(err instanceof Error ? err : new Error(String(err)))
      })
    })
  }, [])

  /**
   * Fire-and-forget variant for messages that don't expect a reply.
   *
   * sendNoWait('LED')          -> writes "LED"
   * sendNoWait('LED', 'on')    -> writes "LED:on"
   */
  const sendNoWait = useCallback(async (cmd: string, payload?: string) => {
    if (!writeCharRef.current || !deviceRef.current?.gatt?.connected) return

    try {
      const message = buildMessage(cmd, payload)
      console.log(message)
      const encoded = new TextEncoder().encode(message)
      await writeCharRef.current.writeValueWithResponse(encoded)
    } catch {
      toast.error('Failed to send message')
    }
  }, [])

  return {
    connect,
    send,
    sendNoWait,
    connected,
    addIncomingCallback,
    removeIncomingCallback,
  }
}
