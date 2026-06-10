import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { CharacterBackground } from '@/components/background/character-background'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar showCalendar />
      <main className="flex-1 flex flex-col items-center justify-between py-5 gap-5">
        <section>
          <h2 className="text-center">Volume Botol</h2>
          <h1 className="text-4xl font-bold tracking-wide text-center">293 ML</h1>
        </section>
        <section className="max-w-32 w-full h-full max-h-96 bg-white rounded-full p-2">
          <div className="bg-gray-200 rounded-full h-full flex overflow-hidden">
            <div className="relative bg-sky-400 h-[50%] w-full mt-auto rounded-full">
              <p className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-3xl text-white">
                10%
              </p>
            </div>
          </div>
        </section>
        <section className="max-w-88 w-full space-y-3">
          <div className="w-full max-w-xl bg-white rounded-full relative py-2 px-2">
            <p className="relative z-1 text-center text-sm text-gray-900 font-semibold">
              890/2100 ML
            </p>
            <div className="absolute top-0 left-0 w-full h-full p-1">
              <div className="bg-gray-100 rounded-full w-full h-full overflow-hidden">
                <div className="bg-sky-400 rounded-full w-full h-full scale-x-50 origin-left" />
              </div>
            </div>
          </div>
          <p className="font-semibold text-gray-700 text-center">
            Lanjutkan streak 19 minum air terpenuhi
          </p>
          <Button>Catat Minum</Button>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
