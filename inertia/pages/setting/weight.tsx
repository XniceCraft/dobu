import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Button, LoadingButton } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { WheelPicker, WheelPickerWrapper } from '@/components/field/wheel-picker'
import { ChevronLeftIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/mini'
import { signUpSchema } from '@/lib/validations/user'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import { generateValues } from '@/lib/utils/array'

type PageProps = InertiaProps<{
  user: Data.User.Variants['detailed']
}>

const weightOptions = generateValues(10, 500, 1).map((value) => {
  return {
    value,
    label: `${value} kg`,
  }
})

const weightSchema = z.pick(z.object(signUpSchema.shape), { weight: true })

export default function WeightSetting({ user }: PageProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof weightSchema>>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      weight: user.weight,
    },
  })

  const onSubmit = useCallback((data: z.infer<typeof weightSchema>) => {
    router.visit(
      {
        route: 'setting.account.update',
      },
      {
        method: 'post',
        data,
        preserveState: true,
        onError: (errors) => {
          Object.entries(errors).forEach(([field, message]) => {
            form.setError(field as keyof z.infer<typeof weightSchema>, {
              message,
            })
          })
        },
        onSuccess: () => {
          toast.success('Berat badan berhasil diperbarui')
        },
      }
    )
  }, [])

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col py-5 mx-auto w-full max-w-96">
        <section className="flex gap-3 items-center mb-5">
          <Button variant="ghost" size="icon" asChild>
            <Link route="setting.account">
              <ChevronLeftIcon />
            </Link>
          </Button>
          <h1 className="text-lg">Pengaturan Berat Badan</h1>
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

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              control={form.control}
              name="weight"
              render={({ field }) => (
                <WheelPickerWrapper>
                  <WheelPicker
                    options={weightOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    scrollSensitivity={8}
                  />
                </WheelPickerWrapper>
              )}
            />
            <Field>
              <LoadingButton variant="gradient" loading={form.formState.isSubmitting} type="submit">
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
