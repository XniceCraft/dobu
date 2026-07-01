import { Head } from '@inertiajs/react'
import { CharacterBackground } from '@/components/background/character-background'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Navbar } from '@/components/layout/navbar'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import { CharacterSelector } from './dress/_components/character-selector'

export default function DressPage({
  characters,
  calendar,
  userCharacter,
}: InertiaProps<{
  characters: Data.Character[]
  userCharacter: number | null
  calendar: Record<string, boolean>
}>) {
  return (
    <>
      <Head title="Pakaian" />
      <div className="h-screen flex flex-col relative overflow-hidden">
        <CharacterBackground />

        <Navbar calendar={calendar} />
        <main className="flex-1 flex flex-col items-center justify-center py-5">
          {characters.length === 0 ? (
            <div className="flex flex-col items-center gap-5 text-center">
              <h1 className="text-2xl font-bold text-amber-800">Belum ada Karakter</h1>
            </div>
          ) : (
            <CharacterSelector
              characters={characters}
              selectedId={userCharacter ?? characters[0].id}
            />
          )}
        </main>

        <MobileNavigation />
      </div>
    </>
  )
}
