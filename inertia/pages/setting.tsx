import { Link } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button } from '@/components/ui/button'
import {
  AwardIcon,
  BugIcon,
  ChartAreaIcon,
  ChevronRightIcon,
  CircleUserIcon,
  type LucideIcon,
  XIcon,
} from 'lucide-react'
import type { urlFor } from '@/client'

const menu: { label: string; icon: LucideIcon; route: Parameters<typeof urlFor>[0] }[] = [
  {
    label: 'Grafik dan Laporan',
    route: 'home',
    icon: ChartAreaIcon,
  },
  {
    label: 'Pengaturan Akun',
    route: 'home',
    icon: CircleUserIcon,
  },
  {
    label: 'Leaderboard Keluarga',
    route: 'tracking',
    icon: AwardIcon,
  },
  {
    label: 'Laporkan Bug',
    route: 'home',
    icon: BugIcon,
  },
]

export default function Setting() {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col py-5 mx-auto w-full max-w-96">
        <section className="flex gap-3 items-center mb-5">
          <Button variant="ghost" size="icon" asChild>
            <Link route="home">
              <XIcon />
            </Link>
          </Button>
          <h1 className="text-lg">Pengaturan</h1>
        </section>

        <section className="bg-white p-8 rounded-xl shadow space-y-4 text-gray-600">
          {menu.map((item) => (
            <Link route={item.route} key={item.label} className="flex gap-2 items-center">
              <item.icon className="size-4" />
              <div className="w-full border-b flex items-center justify-between py-2">
                <p className="text-sm font-medium">{item.label}</p>
                <ChevronRightIcon className="size-4" />
              </div>
            </Link>
          ))}
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
