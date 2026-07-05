import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function BirthdateField({
  value,
  onChange,
}: {
  value?: Date | undefined
  onChange?: (value: Date) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className={cn('justify-start font-normal', value ? 'text-gray-900' : 'text-gray-500')}
        >
          <CalendarIcon />
          {value ? value.toLocaleDateString() : 'Masukkan tanggal lahir anda'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          captionLayout="dropdown"
          onSelect={(value) => {
            onChange?.(value)
            setOpen(false)
          }}
          required
        />
      </PopoverContent>
    </Popover>
  )
}
