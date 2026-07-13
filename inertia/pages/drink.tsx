import { useRouter } from '@adonisjs/inertia/react'
import { useCallback } from 'react'
import { useBottle } from '@/providers/bottle-provider'
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
import { generateValues } from '@/lib/utils/array'

import type { WheelPickerOption } from '@/components/field/wheel-picker'
import type { InertiaProps } from '@/types'

const amounts: WheelPickerOption[] = generateValues(50, 2000, 50).map((amount) => ({
  value: amount.toString(),
  label: `${amount} ml`,
}))

const drinkSchema = z.object({
  amount: z.coerce
    .number<number>()
    .check(z.gte(50, 'Jumlah minimal adalah 50 ml'), z.lte(2000, 'Jumlah maksimal adalah 2000 ml')),
})

export default function Drink({
  calendar,
}: InertiaProps<{
  calendar: Record<string, number>
}>) {
  const { connected, send } = useBottle()
  const router = useRouter()
  const { control, setError, handleSubmit, formState } = useForm<z.infer<typeof drinkSchema>>({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      amount: 200,
    },
  })

  const onSubmit = useCallback(
    async (data: z.infer<typeof drinkSchema>) => {
      router.visit(
        {
          route: 'drink.store',
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof z.infer<typeof drinkSchema>, {
                message,
              })
            })
          },
          onSuccess: () => {
            toast.success('Berhasil mencatat')
          },
        }
      )
      if (connected) {
        await send('MANUAL_DRINK', String(data.amount))
      }
    },
    [router, setError, connected, send]
  )

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <CharacterBackground />
      <Navbar calendar={calendar} />

      <main className="min-h-0 mx-auto max-w-72 w-full flex flex-1 flex-col gap-3 items-center py-5">
        <Card className="w-full h-full max-h-96 gap-0 rounded-3xl">
          <CardHeader className="py-4">
            <CardTitle className="text-center text-xl font-bold text-slate-800">
              Catat Minum Mu!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form id="drink-form" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
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
            loading={formState.isSubmitting}
          >
            Catat!
          </LoadingButton>
        </Field>
      </main>

      <MobileNavigation />
    </div>
  )
}
