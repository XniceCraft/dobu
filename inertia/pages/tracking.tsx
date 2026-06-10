import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { CharacterBackground } from '@/components/background/character-background'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const members = [
  {
    avatar: 'https://placehold.co/100x100/webp',
    currentDrink: 1000,
    targetDrink: 2500,
  },
  {
    avatar: 'https://placehold.co/100x100/webp',
    currentDrink: 890,
    targetDrink: 2300,
  },
  {
    avatar: 'https://placehold.co/100x100/webp',
    currentDrink: 700,
    targetDrink: 2100,
  },
  {
    avatar: 'https://placehold.co/100x100/webp',
    currentDrink: 600,
    targetDrink: 2000,
  },
  {
    avatar: 'https://placehold.co/100x100/webp',
    currentDrink: 100,
    targetDrink: 1700,
  },
]

export default function Tracking() {
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
                {members.map((member) => (
                  <div
                    key={member.targetDrink}
                    className="relative bg-gray-200 rounded-full h-8 flex items-center justify-center"
                  >
                    <img
                      src={member.avatar}
                      alt="Avatar"
                      className="absolute top-1/2 left-0 -translate-1/2 w-10 h-10 rounded-full object-cover z-1"
                    />
                    <div
                      className="absolute bg-sky-400 top-0 left-0 w-full h-full origin-left rounded-full"
                      style={{ transform: `scaleX(${member.currentDrink / member.targetDrink})` }}
                    />
                    <p className="relative z-2 text-sm font-medium">{`${member.currentDrink}/${member.targetDrink} ML`}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="space-y-5">
                {members.map((member) => (
                  <div
                    key={member.targetDrink}
                    className="relative bg-gray-200 rounded-full h-8 flex items-center justify-center"
                  >
                    <img
                      src={member.avatar}
                      alt="Avatar"
                      className="absolute top-1/2 left-0 -translate-1/2 w-10 h-10 rounded-full object-cover z-1"
                    />
                    <div
                      className="absolute bg-sky-400 top-0 left-0 w-full h-full origin-left rounded-full"
                      style={{ transform: `scaleX(${member.currentDrink / member.targetDrink})` }}
                    />
                    <p className="relative z-2 text-sm font-medium">{`${member.currentDrink}/${member.targetDrink} ML`}</p>
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
