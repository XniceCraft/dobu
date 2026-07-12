import { useMemo } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { cn } from '@/lib/utils'
import { getStreak } from '@/lib/utils/streak'

import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'

function StreakBlob({ streak }: { streak: number }) {
  const { purple, blue } = useMemo(() => getStreak(streak), [streak])

  return (
    <div className="flex gap-1">
      {Array.from({ length: purple }).map((_, i) => (
        <img
          key={i}
          src="/assets/image/droplet-purple.webp"
          alt="Droplet Purple"
          className="size-3 object-contain"
        />
      ))}
      {Array.from({ length: blue }).map((_, i) => (
        <img
          key={i}
          src="/assets/image/droplet.webp"
          alt="Droplet Blue"
          className="size-3 object-contain"
        />
      ))}
    </div>
  )
}

export default function LeaderboardPage({
  members,
}: InertiaProps<{
  members: Data.User.Variants['toWithDrinkPreference'][]
}>) {
  return (
    <>
      <Head title="Leaderboard Keluarga" />

      <div className="h-screen flex flex-col relative overflow-hidden">
        <img
          alt="Background Left Top"
          className="absolute top-0 -left-5 min-w-2xl h-auto object-contain -z-1 -translate-1/4"
          src="/assets/image/leaderboard/line.webp"
        />

        <img
          alt="Background Right Top"
          className="absolute top-3/4 right-8 min-w-2xl h-auto object-contain -z-1 translate-x-1/2 -translate-y-1/2"
          src="/assets/image/leaderboard/trophy.webp"
        />

        <main className="flex-1 flex flex-col py-5 mx-auto w-full max-w-96">
          <section className="flex gap-3 items-center mb-5">
            <Button variant="ghost" size="icon" asChild>
              <Link route="setting.account">
                <ChevronLeftIcon />
              </Link>
            </Button>
            <h1 className="text-lg">Leaderboard Keluarga</h1>
          </section>

          <section className="bg-white rounded-3xl shadow overflow-hidden">
            <div className="flex px-8">
              <h2 className="max-w-16 w-full py-3 border-r">Rank</h2>
              <h2 className="w-full py-3 pl-4">Username</h2>
            </div>

            {members.map((member, index) => (
              <div
                key={member.id}
                className={cn('flex px-8', index % 2 ? 'bg-white' : 'bg-[#D8F7FF]')}
              >
                <p className="max-w-16 w-full text-[#4D80F4] font-bold text-4xl ps-2 py-3 border-r">
                  {index + 1}
                </p>
                <div className="flex gap-3 py-3 pl-4">
                  <img
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                    src={member.avatar ?? undefined}
                  />
                  <div>
                    <p className="w-full font-semibold">{member.name}</p>
                    <div className="flex gap-2 items-center">
                      <p className="text-xs text-muted-foreground">
                        Streak: {member.drinkPreference.streak}
                      </p>
                      <StreakBlob streak={member.drinkPreference.streak} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>

        <MobileNavigation />
      </div>
    </>
  )
}
