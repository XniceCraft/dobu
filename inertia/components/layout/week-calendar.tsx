import { memo, useMemo } from 'react'
import { getCurrentWeekDays, toDateKey } from '@/lib/calendar'
import { cn } from '@/lib/utils'

interface WeekCalendarProps {
  logs?: Record<string, boolean>
}

export const WeekCalendar = memo(function ({ logs = {} }: WeekCalendarProps) {
  const days = useMemo(() => getCurrentWeekDays(), [])
  const todayKey = useMemo(() => toDateKey(new Date()), [])

  return (
    <div className="bg-gray-100 flex justify-around p-2 rounded-xl">
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
                isLogged
                  ? drank
                    ? 'bg-blue-200 text-blue-900'
                    : 'bg-red-200 text-red-900'
                  : 'bg-gray-200 text-gray-400'
              )}
            >
              {date.getDate()}
            </span>
          </div>
        )
      })}
    </div>
  )
})
