import { Head } from '@inertiajs/react'
import { CharacterBackground } from '@/components/background/character-background'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Navbar } from '@/components/layout/navbar'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

export default function DressPage({
  characters,
  calendar,
}: InertiaProps<{
  characters: Data.Character[]
  calendar: Record<string, boolean>
}>) {
  return (
    <>
      <Head title="Pakaian" />
      <div className="h-screen flex flex-col relative overflow-hidden">
        <CharacterBackground />

        <Navbar calendar={calendar} />
        <main className="flex-1 flex flex-col items-center justify-between py-5">
          <section>
            <h2 className="text-center">Target Hari Ini</h2>
          </section>

          <section className="max-w-88 w-full space-y-3">
            <div className="w-full max-w-xl bg-white rounded-full relative py-2 px-2"></div>
          </section>
        </main>

        <MobileNavigation />
      </div>
    </>
  )
}
