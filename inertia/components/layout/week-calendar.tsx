import { memo, useMemo } from 'react'
import { getCurrentWeekDays, toDateKey } from '@/lib/utils/calendar'
import { cn } from '@/lib/utils'
import { Link } from '@adonisjs/inertia/react'

interface WeekCalendarProps {
  logs?: Record<string, number>
}

const styles = [
  'bg-red-200 text-red-900',
  'bg-orange-200 text-orange-900',
  'bg-blue-200 text-blue-900',
]

export const WeekCalendar = memo(function ({ logs = {} }: WeekCalendarProps) {
  const days = useMemo(() => getCurrentWeekDays(), [])
  const todayKey = useMemo(() => toDateKey(new Date()), [])

  return (
    <Link route="stats.index" className="bg-gray-100 flex justify-around p-2 rounded-xl">
      {days.map(({ label, date, dateKey }) => {
        const drank = logs[dateKey]
        const isLogged = dateKey in logs
        const isToday = dateKey === todayKey

        return (
          <div key={dateKey} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                'text-[10px] font-semibold',
                isToday ? 'text-blue-500' : 'text-gray-400'
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                'size-7 rounded-full flex items-center justify-center text-xs font-bold',
                isLogged ? styles[drank] : 'bg-gray-200 text-gray-400'
              )}
            >
              {date.getDate()}
            </span>
          </div>
        )
      })}
    </Link>
  )
})
