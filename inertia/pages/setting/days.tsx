import { useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button, LoadingButton } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { WheelPicker, WheelPickerWrapper } from '@/components/field/wheel-picker'
import { ChevronLeftIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateValues } from '@/lib/utils/array'
import { z } from 'zod/mini'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

const hourOptions = generateValues(0, 23, 1).map((value) => ({
  label: value.toString().padStart(2, '0'),
  value: value,
}))
const minuteOptions = generateValues(0, 59, 10).map((value) => ({
  label: value.toString().padStart(2, '0'),
  value: value,
}))

const daysSchema = z.object({
  dayStart: z.object({
    hour: z.int().check(z.gte(0), z.lte(23)),
    minute: z.int().check(z.gte(0), z.lte(59)),
  }),
  dayEnd: z.object({
    hour: z.int().check(z.gte(0), z.lte(23)),
    minute: z.int().check(z.gte(0), z.lte(59)),
  }),
})

export default function WorkTypeSetting({
  user,
}: InertiaProps<{
  user: Data.User.Variants['detailed']
}>) {
  const router = useRouter()
  const defaultValues = useMemo(() => {
    return {
      dayStart: {
        hour: Number.parseInt(user.profile.dayStart.split(':')[0]),
        minute: Number.parseInt(user.profile.dayStart.split(':')[1]),
      },
      dayEnd: {
        hour: Number.parseInt(user.profile.dayEnd.split(':')[0]),
        minute: Number.parseInt(user.profile.dayEnd.split(':')[1]),
      },
    }
  }, [user.profile.dayStart, user.profile.dayEnd])
  const { control, handleSubmit, setError, formState } = useForm<z.infer<typeof daysSchema>>({
    resolver: zodResolver(daysSchema),
    defaultValues,
  })

  const onSubmit = useCallback(
    (data: z.infer<typeof daysSchema>) => {
      router.visit(
        {
          route: 'setting.profile.update',
        },
        {
          method: 'post',
          data: {
            dayStart: `${data.dayStart.hour}:${data.dayStart.minute}:00`,
            dayEnd: `${data.dayEnd.hour}:${data.dayEnd.minute}:00`,
          },
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof z.infer<typeof daysSchema>, {
                message,
              })
            })
          },
          onSuccess: () => {
            toast.success('Waktu keseharian berhasil diperbarui')
          },
        }
      )
    },
    [router, setError]
  )

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col py-5 mx-auto w-full max-w-96">
        <section className="flex gap-3 items-center mb-5">
          <Button variant="ghost" size="icon" asChild>
            <Link route="setting.account">
              <ChevronLeftIcon />
            </Link>
          </Button>
          <h1 className="text-lg">Pengaturan Waktu Keseharian</h1>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <WheelPickerWrapper>
              <Controller
                control={control}
                name="dayStart.hour"
                render={({ field }) => (
                  <WheelPicker
                    options={hourOptions}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    scrollSensitivity={8}
                    infinite
                  />
                )}
              />
              <Controller
                control={control}
                name="dayStart.minute"
                render={({ field }) => (
                  <WheelPicker
                    options={minuteOptions}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    scrollSensitivity={8}
                    infinite
                  />
                )}
              />
              <p className="my-auto">s.d.</p>
              <Controller
                control={control}
                name="dayEnd.hour"
                render={({ field }) => (
                  <WheelPicker
                    options={hourOptions}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    scrollSensitivity={8}
                    infinite
                  />
                )}
              />
              <Controller
                control={control}
                name="dayEnd.minute"
                render={({ field }) => (
                  <WheelPicker
                    options={minuteOptions}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    scrollSensitivity={8}
                    infinite
                  />
                )}
              />
            </WheelPickerWrapper>
            <Field>
              <LoadingButton variant="gradient" loading={formState.isSubmitting} type="submit">
                Simpan
              </LoadingButton>
            </Field>
          </form>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
