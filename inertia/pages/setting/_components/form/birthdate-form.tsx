import { Controller, useController, useWatch, type Control } from 'react-hook-form'
import { WheelPicker, WheelPickerWrapper } from '@/components/field/wheel-picker'
import { useMemo } from 'react'

const currentYear = new Date().getFullYear()
const minYear = currentYear - 100

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const monthOptions = monthNames.map((name, index) => ({
  label: name,
  value: index,
}))

const yearOptions = Array.from({ length: 101 }, (_, i) => {
  const year = minYear + i
  return {
    label: year.toString(),
    value: year,
  }
})

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

interface ControlProps {
  day: number
  month: number
  year: number
}

export function BirthdateForm({ control }: { control: Control<ControlProps> }) {
  const {
    field: { value: dayValue, onChange: onChangeDay },
  } = useController({ control, name: 'day' })
  const watchedMonth = useWatch({ control, name: 'month' })
  const watchedYear = useWatch({ control, name: 'year' })

  const maxDay = useMemo(
    () => getDaysInMonth(watchedMonth ?? 0, watchedYear ?? currentYear),
    [watchedMonth, watchedYear]
  )

  const dayOptions = useMemo(() => {
    return Array.from({ length: maxDay }, (_, i) => ({
      label: (i + 1).toString().padStart(2, '0'),
      value: i + 1,
    }))
  }, [maxDay])

  return (
    <WheelPickerWrapper>
      <Controller
        control={control}
        name="day"
        render={({ field }) => (
          <WheelPicker
            options={dayOptions}
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            scrollSensitivity={8}
            infinite
          />
        )}
      />
      <Controller
        control={control}
        name="month"
        render={({ field }) => (
          <WheelPicker
            options={monthOptions}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value)

              const maxDay2 = getDaysInMonth(value, watchedYear ?? currentYear)
              if (dayValue > maxDay2) {
                onChangeDay(maxDay2)
              }
            }}
            scrollSensitivity={8}
            infinite
          />
        )}
      />
      <Controller
        control={control}
        name="year"
        render={({ field }) => (
          <WheelPicker
            options={yearOptions}
            value={field.value}
            onValueChange={(value) => field.onChange(value)}
            scrollSensitivity={8}
            infinite
          />
        )}
      />
    </WheelPickerWrapper>
  )
}
