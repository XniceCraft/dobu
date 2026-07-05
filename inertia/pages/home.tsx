import { Link } from '@adonisjs/inertia/react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { CharacterBackground } from '@/components/background/character-background'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Separator } from '@/components/ui/separator'
import { ClockIcon } from '@phosphor-icons/react'
import { clamp } from '@/lib/utils/math'

import type { InertiaProps } from '@/types'
import { Head } from '@inertiajs/react'

export default function Home({
  streak,
  calendar,
  targetPerInterval,
  targetMl,
  todayDrinkMl,
  intervalMinutes,
}: InertiaProps<{
  streak: number
  calendar: Record<string, boolean>
  targetPerInterval: number
  targetMl: number
  todayDrinkMl: number
  intervalMinutes: number
}>) {
  return (
    <>
      <Head title="Beranda" />

      <div className="h-screen flex flex-col relative overflow-hidden">
        <CharacterBackground />

        <Navbar calendar={calendar} />
        <main className="flex-1 flex flex-col items-center justify-between py-5">
          <section>
            <h2 className="text-center">Target Hari Ini</h2>
            <h1 className="text-4xl font-bold tracking-wide text-center">{`${targetMl} ML`}</h1>
          </section>

          <section className="max-w-88 w-full space-y-3">
            <div className="w-full max-w-xl bg-white rounded-full relative py-2 px-2">
              <p className="relative z-1 text-center text-sm text-gray-900 font-semibold">
                {`${todayDrinkMl}/${targetMl} ML`}
              </p>
              <div className="absolute top-0 left-0 w-full h-full p-1">
                <div className="bg-gray-100 rounded-full w-full h-full overflow-hidden">
                  <div
                    className="bg-sky-400 rounded-full w-full h-full origin-left"
                    style={{
                      transform: `scaleX(${clamp(todayDrinkMl / targetMl, 0, 1)})`,
                    }}
                  />
                </div>
              </div>
            </div>
            <p className="font-semibold text-gray-700 text-center">
              Lanjutkan streak {streak} minum air terpenuhi
            </p>
            <div className="flex gap-3">
              <Button variant="gradient" className="flex-1/2 h-auto" asChild>
                <Link route="drink.create">Catat Minum</Link>
              </Button>
              <div className="flex-1/2 bg-white rounded-full px-4 py-1 inline-flex gap-2 justify-center items-center shadow">
                <ClockIcon className="size-8 text-sky-400" weight="fill" />
                <span className="text-3xl font-bold">{intervalMinutes}</span>
                <div className="-space-y-2">
                  <span className="text-[0.6rem]">menit</span>
                  <Separator />
                  <span className="text-[0.6rem] font-bold">{targetPerInterval} ml</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <MobileNavigation />
      </div>
    </>
  )
}
