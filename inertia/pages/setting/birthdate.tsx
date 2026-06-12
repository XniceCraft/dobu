import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { BirthdateForm } from './_components/form/birthdate-form'
import { Button, LoadingButton } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { ChevronLeftIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/mini'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  user: Data.User.Variants['detailed']
}>

const currentYear = new Date().getFullYear()
const minYear = currentYear - 100

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

const birthdateFormSchema = z
  .object({
    day: z.coerce
      .number<number>()
      .check(z.gte(1, 'Hari tidak valid'))
      .check(z.lte(31, 'Hari tidak valid')),
    month: z.coerce
      .number<number>()
      .check(z.gte(0, 'Bulan tidak valid'))
      .check(z.lte(11, 'Bulan tidak valid')),
    year: z.coerce
      .number<number>()
      .check(z.gte(minYear, 'Tahun tidak valid'))
      .check(z.lte(currentYear, 'Tahun tidak valid')),
  })
  .check(
    z.refine(
      (data) => {
        const maxDay = getDaysInMonth(data.month, data.year)
        return data.day <= maxDay
      },
      {
        error: 'Tanggal tidak valid untuk bulan tersebut',
        path: ['day'],
      }
    )
  )

export default function BirthDateSetting({ user }: PageProps) {
  const router = useRouter()

  const getDefaultValues = () => {
    if (user.birthdate) {
      const dateStr = user.birthdate.toString()
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
      if (match) {
        return {
          year: Number.parseInt(match[1], 10),
          month: Number.parseInt(match[2], 10) - 1,
          day: Number.parseInt(match[3], 10),
        }
      }
      const date = new Date(dateStr)
      if (!Number.isNaN(date.getTime())) {
        return {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        }
      }
    }
    const fallback = new Date()
    fallback.setFullYear(fallback.getFullYear() - 20)
    return {
      day: fallback.getDate(),
      month: fallback.getMonth(),
      year: fallback.getFullYear(),
    }
  }

  const form = useForm<z.infer<typeof birthdateFormSchema>>({
    resolver: zodResolver(birthdateFormSchema),
    defaultValues: getDefaultValues(),
  })

  const onSubmit = useCallback(
    (data: z.infer<typeof birthdateFormSchema>) => {
      const birthdate = new Date(Date.UTC(data.year, data.month, data.day, 12, 0, 0))

      router.visit(
        {
          route: 'setting.account.update',
        },
        {
          method: 'post',
          data: { birthdate },
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              form.setError(field as any, { message })
            })
          },
          onSuccess: () => {
            toast.success('Tanggal lahir berhasil diperbarui')
          },
        }
      )
    },
    [router]
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
          <h1 className="text-lg">Pengaturan Tanggal Lahir</h1>
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
            <BirthdateForm control={form.control} />
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
