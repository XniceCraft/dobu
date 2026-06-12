import { Link } from '@adonisjs/inertia/react'
import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { CharacterBackground } from '@/components/background/character-background'
import { DualStyleButton } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ClockIcon } from '@phosphor-icons/react'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps & {
  drink: Data.Drink
}

export default function Home({ user, drink }: PageProps) {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar showCalendar />
      <main className="flex-1 flex flex-col items-center justify-between py-5">
        <section>
          <h2 className="text-center">Target Hari Ini</h2>
          <h1 className="text-4xl font-bold tracking-wide text-center">{`${user!.milliliterTarget} ML`}</h1>
        </section>

        <section className="max-w-88 w-full space-y-3">
          <div className="w-full max-w-xl bg-white rounded-full relative py-2 px-2">
            <p className="relative z-1 text-center text-sm text-gray-900 font-semibold">
              {`${drink.milliliter}/${user!.milliliterTarget} ML`}
            </p>
            <div className="absolute top-0 left-0 w-full h-full p-1">
              <div className="bg-gray-100 rounded-full w-full h-full overflow-hidden">
                <div
                  className="bg-sky-400 rounded-full w-full h-full origin-left"
                  style={{ transform: `scaleX(${drink.milliliter / user!.milliliterTarget})` }}
                />
              </div>
            </div>
          </div>
          <p className="font-semibold text-gray-700 text-center">
            Lanjutkan streak 19 minum air terpenuhi
          </p>
          <div className="flex gap-3">
            <DualStyleButton className="flex-1/2 h-auto" asChild>
              <Link route="drink.create">Catat Minum</Link>
            </DualStyleButton>
            <div className="flex-1/2 bg-white rounded-full px-4 py-1 inline-flex gap-2 justify-center items-center shadow">
              <ClockIcon className="size-8 text-sky-400" weight="fill" />
              <span className="text-3xl font-bold">20</span>
              <div className="-space-y-2">
                <span className="text-[0.6rem]">menit</span>
                <Separator />
                <span className="text-[0.6rem] font-bold">135ml</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
