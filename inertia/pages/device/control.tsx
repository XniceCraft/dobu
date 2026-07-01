import { CharacterBackground } from '@/components/background/character-background'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { useBottle } from '@/providers/bottle-provider'
import { useEffect, useState } from 'react'

export default function DeviceControlPage() {
  const [messages, setMessages] = useState<string[]>([])
  const { send, addIncomingCallback, removeIncomingCallback } = useBottle()

  useEffect(() => {
    addIncomingCallback((message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      removeIncomingCallback()
    }
  }, [addIncomingCallback, removeIncomingCallback])

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-5 gap-5">
        <section className="max-w-88 w-full h-full max-h-96 bg-white rounded-xl p-10">
          <Button onClick={() => send('PING')}>PING</Button>
          <Button onClick={() => send('GET_VOLUME')}>GET_VOLUME</Button>
          <Button onClick={() => send('REQUEST_STATUS')}>REQUEST_STATUS</Button>
          <Button onClick={() => send('ESP_RUNNING')}>ESP_RUNNING</Button>

          <div className="space-y-3 mt-5 overflow-y-auto max-h-96">
            {messages.map((message, index) => (
              <div key={index} className="text-gray-500 font-mono p-2 rounded">
                {message}
              </div>
            ))}
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
