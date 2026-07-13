import { Button } from '@/components/ui/button'
import { CharacterBackground } from '@/components/background/character-background'
import { Link } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Navbar } from '@/components/layout/navbar'
import { UserList } from './_components/user-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShareIcon } from 'lucide-react'
import { PlusIcon } from '@phosphor-icons/react'

import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'

export default function Family({
  drink,
  calendar,
}: InertiaProps<{
  drink: {
    daily: Data.User.Variants['toRanked'][]
    weekly: Data.User.Variants['toRanked'][]
  } | null
  calendar: Record<string, number>
}>) {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar calendar={calendar} />
      <main className="flex-1 flex flex-col items-center justify-center py-5">
        <section className="bg-white rounded-3xl py-8 px-12 max-w-88 w-full h-full max-h-96">
          {drink ? (
            <Tabs defaultValue="daily">
              <div className="flex">
                <TabsList className="mx-auto mb-5 bg-sky-50">
                  <TabsTrigger value="daily" className="data-active:shadow-sm">
                    Harian
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="data-active:shadow-sm">
                    Mingguan
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" asChild>
                  <Link route="family.invite">
                    <PlusIcon className="text-2xl" />
                  </Link>
                </Button>
              </div>
              <TabsContent value="daily">
                <div className="space-y-5">
                  {drink.daily.map((member) => (
                    <UserList
                      key={member.id}
                      avatar={member.avatar ?? ''}
                      totalMl={member.totalMl}
                      targetMl={member.drinkPreference.targetMl}
                      character={member.character?.image}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="weekly">
                <div className="space-y-5">
                  {drink.weekly.map((member) => (
                    <UserList
                      key={member.id}
                      avatar={member.avatar ?? ''}
                      totalMl={member.totalMl}
                      targetMl={member.drinkPreference.targetMl * 7}
                      character={member.character?.image}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-center mb-2">Kamu belum memasuki grup keluarga</p>
              <p className="text-center text-sm mb-5">Buat baru atau gabung dengan link</p>
              <Button className="w-full" asChild>
                <Link route="family.store">
                  <ShareIcon />
                  Buat Grup
                </Link>
              </Button>
            </div>
          )}
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
