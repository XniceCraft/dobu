import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button } from '@/components/ui/button'
import { CharacterBackground } from '@/components/background/character-background'
import { useBLE } from '@/hooks/use-ble'

import type { InertiaProps } from '@/types'

type PageProps = InertiaProps & {
  calendar: Record<string, boolean>
}

export default function DevicePair({ calendar }: PageProps) {
  const bluetooth = useBLE()

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar calendar={calendar} />
      <main className="flex-1 flex flex-col items-center justify-center py-5 gap-5">
        <section className="max-w-88 w-full h-full max-h-96 bg-white rounded-xl p-10">
          <h1 className="text-lg font-semibold text-center">Hubungkan Botol</h1>
          <Button onClick={bluetooth.connect}>Hubungkan Botol</Button>
          {bluetooth.connected && <Button onClick={() => bluetooth.send('GET_VOLUME')}></Button>}
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
