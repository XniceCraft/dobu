import { useBottle } from '@/providers/bottle-provider'
import { Link } from '@adonisjs/inertia/react'
import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button } from '@/components/ui/button'
import { CharacterBackground } from '@/components/background/character-background'
import { clamp } from '@/lib/utils/math'

import type { InertiaProps } from '@/types'

export default function DevicePage({
  targetMl,
  todayDrinkMl,
  streak,
  calendar,
  deltaMl,
  targetPerInterval,
  intervalMinutes,
  drinkCount,
}: InertiaProps<{
  deltaMl: number
  todayDrinkMl: number
  targetMl: number
  intervalMinutes: number
  targetPerInterval: number
  drinkCount: number
  streak: number
  calendar: Record<string, boolean>
}>) {
  const { connect, bottle, connected, initializeData } = useBottle()

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar calendar={calendar} />
      <main className="flex-1 flex flex-col items-center justify-between py-5 gap-5">
        {bottle && connected ? (
          <>
            <section>
              <h2 className="text-center">Volume Botol</h2>
              <h1 className="text-4xl font-bold tracking-wide text-center">
                {bottle.remainingMl} ML
              </h1>
            </section>
            <section className="max-w-32 w-full h-full max-h-96 bg-white rounded-full p-2">
              <div className="bg-gray-200 rounded-full h-full flex overflow-hidden relative">
                <div
                  className="relative bg-sky-400 h-full w-full mt-auto rounded-full flex items-center justify-center origin-bottom"
                  style={{ transform: `scaleY(${clamp(bottle.remainingMl / bottle.size, 0, 1)})` }}
                ></div>
                <p className="font-bold text-3xl text-black absolute top-1/2 left-1/2 -translate-1/2">
                  {Math.round((bottle.remainingMl / bottle.size) * 100)}%
                </p>
              </div>
            </section>
          </>
        ) : (
          <section className="max-w-88 w-full h-full max-h-96 flex flex-col items-center justify-center rounded-lg bg-white">
            <p>Tidak ada botol yang tersimpan</p>
            <Button
              variant="gradient"
              onClick={() =>
                connect({ deltaMl, targetMl, intervalMinutes, targetPerInterval, drinkCount })
              }
            >
              Hubungkan Botol
            </Button>
          </section>
        )}
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
          <div className="flex gap-3 flex-col sm:flex-row">
            <Button variant="gradient" className="w-full h-12" asChild>
              <Link route="drink.create">Catat Minum</Link>
            </Button>
            {connected && !bottle && (
              <Button variant="outline" className="w-full h-12" onClick={initializeData}>
                Inisialisasi Data
              </Button>
            )}
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
