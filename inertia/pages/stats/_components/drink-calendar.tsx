import { useCallback, useMemo } from 'react'
import { id } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'

import type { DrinkCalendar } from '@/types/calendar'

export function DrinkCalendar({
  calendar,
  month,
  setMonth,
}: {
  calendar: DrinkCalendar
  month: number
  setMonth: (month: number) => void
}) {
  const monthDate = useMemo(() => new Date(new Date().getFullYear(), month - 1, 1), [month])

  const fullDrinkDates = useMemo(
    () =>
      Object.entries(calendar)
        // eslint-disable-next-line
        .filter(([_, status]) => status === 2)
        .map(([date]) => new Date(date)),
    [calendar]
  )

  const halfDrinkDates = useMemo(
    () =>
      Object.entries(calendar)
        // eslint-disable-next-line
        .filter(([_, status]) => status === 1)
        .map(([date]) => new Date(date)),
    [calendar]
  )

  const noDrinkDates = useMemo(
    () =>
      Object.entries(calendar)
        // eslint-disable-next-line
        .filter(([_, status]) => status === 0)
        .map(([date]) => new Date(date)),
    [calendar]
  )

  const modifiers = useMemo(
    () => ({
      fullDrink: fullDrinkDates,
      halfDrink: halfDrinkDates,
      noDrink: noDrinkDates,
    }),
    [fullDrinkDates, halfDrinkDates, noDrinkDates]
  )

  const handleChangeMonth = useCallback(
    (date: Date) => {
      setMonth(date.getMonth() + 1)
    },
    [setMonth]
  )

  return (
    <section className="max-w-88 w-full mt-4 rounded-2xl bg-[#dbeeff] px-4 py-3">
      <Calendar
        locale={id}
        month={monthDate}
        onMonthChange={handleChangeMonth}
        defaultClassNames={{
          day: 'aspect-square size-auto w-full min-w-(--cell-size) flex items-center justify-center',
        }}
        classNames={{
          today: '',
        }}
        modifiers={modifiers}
        modifiersClassNames={{
          fullDrink: 'bg-blue-200 text-blue-900 shadow-sm shadow-blue-100 font-semibold',
          halfDrink: 'bg-orange-200 text-orange-900 shadow-sm shadow-red-100 font-semibold',
          noDrink: 'bg-red-200 text-red-900 shadow-sm shadow-red-100 font-semibold',
        }}
        className="w-full bg-transparent [&_.rdp-caption_label]:text-[#1a5fa3] [&_.rdp-caption_label]:font-semibold [&_.rdp-weekday]:text-[#4a90c8]/70 [&_.rdp-day_button]:text-[#3a7abf] [&_.rdp-day_button]:hover:bg-white/60 [&_.rdp-today]:bg-[#a8d4f5]/50! [&_.rdp-today]:text-[#1a5fa3]! [&_.rdp-button_previous]:text-[#3b82c4] [&_.rdp-button_previous]:hover:bg-white/50 [&_.rdp-button_next]:text-[#3b82c4] [&_.rdp-button_next]:hover:bg-white/50"
      />
    </section>
  )
}
