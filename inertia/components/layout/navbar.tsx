import { usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { UsersRoundIcon, Share2Icon } from 'lucide-react'

import type { InertiaProps } from '@/types'
import { WeekCalendar } from './week-calendar'

interface NavbarProps {
  calendar?: Record<string, boolean>
}

export function Navbar({ calendar }: NavbarProps) {
  const { user } = usePage<InertiaProps>().props

  return (
    <nav className="bg-white max-w-88 w-full mx-auto px-4 pt-2 pb-4 rounded-b-3xl shadow">
      <section className="flex justify-between items-center gap-3 mb-3">
        <div className="flex justify-center items-center gap-3">
          <Link route="setting">
            <img
              src={user?.avatar ?? 'https://placehold.co/100x100/webp'}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
          </Link>
          <p className="font-bold">Selamat Datang!</p>
        </div>
        <div>
          <Button variant="ghost" size="icon" asChild>
            <Link route="family">
              <UsersRoundIcon />
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Share2Icon />
          </Button>
        </div>
      </section>
      {/* 
      {showCalendar && (
        <div className="bg-gray-200 flex justify-around gap-3 p-2 rounded-xl">
          {calendar.map((item) => (
            <div key={item.date}>
              <p className="font-bold text-xs text-gray-400 text-center mb-1">{item.day}</p>
              <div className="bg-red-200 rounded-full text-center size-6 inline-block">
                <p className="font-bold text-xs inline-block align-middle">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )} */}
      {calendar && <WeekCalendar logs={calendar} />}
    </nav>
  )
}
