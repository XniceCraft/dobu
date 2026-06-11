import { Link } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  user: Data.User.Variants['detailed']
}>

export default function AccountSetting({ user }: PageProps) {
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
          <div className="flex items-center flex-nowrap gap-3">
            <img
              src="https://placehold.co/100x100/webp"
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-semibold truncate">{user.name}</p>
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
