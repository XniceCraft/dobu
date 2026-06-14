import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { CharacterBackground } from '@/components/background/character-background'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'

type PageProps = InertiaProps & {
  drink: {
    daily: Data.User.Variants['toRanked'][]
    weekly: Data.User.Variants['toRanked'][]
  }
}

export default function Family({ drink: { daily, weekly } }: PageProps) {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar showCalendar />
      <main className="flex-1 flex flex-col items-center justify-center py-5">
        <section className="bg-white rounded-3xl py-8 px-12 max-w-88 w-full">
          <Tabs defaultValue="daily">
            <TabsList className="mx-auto mb-5 bg-sky-50">
              <TabsTrigger value="daily" className="data-active:shadow-sm">
                Harian
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-active:shadow-sm">
                Mingguan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <div className="space-y-5">
                {daily.map((member) => (
                  <div
                    key={member.id}
                    className="relative bg-gray-200 rounded-full h-8 flex items-center justify-center"
                  >
                    <img
                      src={member.avatar ?? ''}
                      alt="Avatar"
                      className="absolute top-1/2 left-0 -translate-1/2 w-10 h-10 rounded-full object-cover z-1"
                    />
                    <div
                      className="absolute bg-sky-400 top-0 left-0 w-full h-full origin-left rounded-full"
                      style={{
                        transform: `scaleX(${member.milliliter / member.milliliterTarget})`,
                      }}
                    />
                    <p className="relative z-2 text-sm font-medium">{`${member.milliliter}/${member.milliliterTarget} ML`}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="space-y-5">
                {weekly.map((member) => (
                  <div
                    key={member.id}
                    className="relative bg-gray-200 rounded-full h-8 flex items-center justify-center"
                  >
                    <img
                      src={member.avatar ?? ''}
                      alt="Avatar"
                      className="absolute top-1/2 left-0 -translate-1/2 w-10 h-10 rounded-full object-cover z-1"
                    />
                    <div
                      className="absolute bg-sky-400 top-0 left-0 w-full h-full origin-left rounded-full"
                      style={{
                        transform: `scaleX(${member.milliliter / (member.milliliterTarget * 7)})`,
                      }}
                    />
                    <p className="relative z-2 text-sm font-medium">{`${member.milliliter}/${member.milliliterTarget * 7} ML`}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
