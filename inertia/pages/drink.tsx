import { useRouter } from '@adonisjs/inertia/react'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Navbar } from '@/components/layout/navbar'
import { CharacterBackground } from '@/components/background/character-background'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { WheelPicker, WheelPickerWrapper } from '@/components/field/wheel-picker'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { z } from 'zod/mini'

import type { WheelPickerOption } from '@/components/field/wheel-picker'

function generateAmounts(min: number = 50, max: number = 2000, step: number = 50): number[] {
  const amounts: number[] = []
  for (let i = min; i <= max; i += step) {
    amounts.push(i)
  }
  return amounts
}

const amounts: WheelPickerOption[] = generateAmounts().map((amount) => ({
  value: amount.toString(),
  label: `${amount} ml`,
}))

const drinkSchema = z.object({
  amount: z.coerce
    .number<number>()
    .check(z.gte(50, 'Jumlah minimal adalah 50 ml'), z.lte(2000, 'Jumlah maksimal adalah 2000 ml')),
})

export default function Drink() {
  const router = useRouter()
  const form = useForm<z.infer<typeof drinkSchema>>({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      amount: 200,
    },
  })

  const onSubmit = useCallback((data: z.infer<typeof drinkSchema>) => {
    router.visit(
      {
        route: 'drink.store',
      },
      {
        method: 'post',
        data,
        preserveState: true,
        onError: (errors) => {
          console.log(errors)
          Object.entries(errors).forEach(([field, message]) => {
            form.setError(field as keyof z.infer<typeof drinkSchema>, {
              message,
            })
          })
        },
        onSuccess: () => {
          toast.success('Berhasil mencatat')
        },
      }
    )
  }, [])

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <CharacterBackground />
      <Navbar showCalendar />

      <main className="min-h-0 mx-auto max-w-72 w-full flex flex-1 flex-col gap-3 items-center py-5">
        <Card className="w-full h-full max-h-96 gap-0 rounded-3xl">
          <CardHeader className="py-4">
            <CardTitle className="text-center text-xl font-bold text-slate-800">
              Catat Minum Mu!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form id="drink-form" onSubmit={form.handleSubmit(onSubmit)}>
              <Controller
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <WheelPickerWrapper>
                    <WheelPicker
                      options={amounts}
                      value={String(field.value)}
                      onValueChange={field.onChange}
                      infinite
                      scrollSensitivity={8}
                    />
                  </WheelPickerWrapper>
                )}
              />
            </form>
          </CardContent>
        </Card>

        <Field>
          <LoadingButton
            variant="gradient"
            size="lg"
            form="drink-form"
            loading={form.formState.isSubmitting}
          >
            Catat!
          </LoadingButton>
        </Field>
      </main>

      <MobileNavigation />
    </div>
  )
}
