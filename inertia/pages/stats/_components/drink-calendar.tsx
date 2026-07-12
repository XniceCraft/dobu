import { useState } from 'react'
import { id } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'

export function DrinkCalendar({
  drinkDates,
  defaultMonth,
}: {
  drinkDates: Date[]
  defaultMonth: Date
}) {
  const [month, setMonth] = useState(defaultMonth)

  return (
    <section className="max-w-88 w-full mt-4 rounded-2xl bg-[#dbeeff] px-4 py-3">
      <Calendar
        locale={id}
        mode="single"
        month={month}
        onMonthChange={setMonth}
        modifiers={{ drink: drinkDates }}
        modifiersClassNames={{
          drink: '!bg-white !text-[#1a5fa3] shadow-sm shadow-blue-100 font-semibold',
        }}
        className="w-full bg-transparent [&_.rdp-caption_label]:text-[#1a5fa3] [&_.rdp-caption_label]:font-semibold [&_.rdp-weekday]:text-[#4a90c8]/70 [&_.rdp-day_button]:text-[#3a7abf] [&_.rdp-day_button]:hover:bg-white/60 [&_.rdp-today]:bg-[#a8d4f5]/50! [&_.rdp-today]:text-[#1a5fa3]! [&_.rdp-button_previous]:text-[#3b82c4] [&_.rdp-button_previous]:hover:bg-white/50 [&_.rdp-button_next]:text-[#3b82c4] [&_.rdp-button_next]:hover:bg-white/50"
      />
    </section>
  )
}
