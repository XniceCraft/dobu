import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button, LoadingButton } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import {
  WheelPicker,
  WheelPickerWrapper,
  type WheelPickerOption,
} from '@/components/field/wheel-picker'
import { ChevronLeftIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { workTypeSchema, type WorkTypeSchema } from '@/lib/validations/user'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

const workTypeOptions: WheelPickerOption[] = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'semi-outdoor', label: 'Semi Outdoor' },
  { value: 'outdoor', label: 'Outdoor' },
]

export default function WorkTypeSetting({
  user,
}: InertiaProps<{
  user: Data.User.Variants['detailed']
}>) {
  const router = useRouter()
  const { control, setError, handleSubmit, formState } = useForm<WorkTypeSchema>({
    resolver: zodResolver(workTypeSchema),
    defaultValues: {
      workType: user.profile.workType,
    },
  })

  const onSubmit = useCallback(
    (data: WorkTypeSchema) => {
      router.visit(
        {
          route: 'setting.profile.update',
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof WorkTypeSchema, {
                message,
              })
            })
          },
          onSuccess: () => {
            toast.success('Jenis pekerjaan berhasil diperbarui')
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
          <h1 className="text-lg">Pengaturan Jenis Pekerjaan</h1>
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
            <Controller
              control={control}
              name="workType"
              render={({ field }) => (
                <WheelPickerWrapper>
                  <WheelPicker
                    options={workTypeOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    scrollSensitivity={8}
                  />
                </WheelPickerWrapper>
              )}
            />
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
