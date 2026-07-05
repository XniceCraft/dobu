import { Link } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button } from '@/components/ui/button'
import {
  BriefcaseBusinessIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock2Icon,
  type LucideIcon,
  TargetIcon,
  WeightIcon,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/date'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import type { urlFor } from '@/client'
import { RulerIcon } from '@phosphor-icons/react'

type PageProps = InertiaProps<{
  user: Data.User.Variants['detailed']
}>

const accountSettingLinks: {
  icon: LucideIcon
  route: Parameters<typeof urlFor>[0] | null
  value: (user: Data.User.Variants['detailed']) => string | null
}[] = [
  {
    icon: CalendarIcon,
    route: 'setting.birthdate',
    value: (user: Data.User.Variants['detailed']) => user.birthdate && formatDate(user.birthdate),
  },
  {
    icon: WeightIcon,
    route: 'setting.weight',
    value: (user: Data.User.Variants['detailed']) => `${user.weight} kg`,
  },
  {
    icon: RulerIcon,
    route: 'setting.height',
    value: (user: Data.User.Variants['detailed']) => `${user.height} cm`,
  },
  {
    icon: Clock2Icon,
    route: 'setting.days',
    value: (user: Data.User.Variants['detailed']) =>
      `${user.dayStart.slice(0, 5)}—${user.dayEnd.slice(0, 5)}`,
  },
  {
    icon: BriefcaseBusinessIcon,
    route: 'setting.work-type',
    value: (user: Data.User.Variants['detailed']) =>
      ({
        'indoor': 'Indoor',
        'semi-outdoor': 'Semi Outdoor',
        'outdoor': 'Outdoor',
      })[user.workType],
  },
  {
    icon: TargetIcon,
    value: (user: Data.User.Variants['detailed']) => `${user.milliliterTarget} ml`,
    route: null,
  },
]

export default function AccountSetting({ user }: PageProps) {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col py-5 mx-auto w-full max-w-96">
        <section className="flex gap-3 items-center mb-5">
          <Button variant="ghost" size="icon" asChild>
            <Link route="setting">
              <ChevronLeftIcon />
            </Link>
          </Button>
          <h1 className="text-lg">Pengaturan Akun</h1>
        </section>

        <section className="bg-white p-8 rounded-xl shadow space-y-4 text-gray-600">
          <div className="flex items-center flex-nowrap gap-3">
            <img
              src={user?.avatar ?? 'https://placehold.co/100x100/webp'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border"
            />
            <p className="font-semibold truncate">{user.name}</p>
          </div>
          {accountSettingLinks.map((accountSettingLink, index) => {
            const routeAvailable = accountSettingLink.route !== null
            const Parent = routeAvailable ? Link : 'div'
            const props = routeAvailable ? { route: accountSettingLink.route! } : {}

            return (
              <Parent key={index} {...props} className="flex gap-2 items-center w-full">
                <accountSettingLink.icon className="size-4" />
                <div className="w-full border-b flex items-center justify-between py-2">
                  <p className="text-sm font-medium">{accountSettingLink.value(user)}</p>
                  {routeAvailable && <ChevronRightIcon className="size-4" />}
                </div>
              </Parent>
            )
          })}
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
