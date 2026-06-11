import { useForm } from 'react-hook-form'
import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { CharacterBackground } from '@/components/background/character-background'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DualStyleButton } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/mini'

const drinkSchema = z.object({
  amount: z
    .number()
    .check(z.gte(50, 'Jumlah minimal adalah 50 ml'), z.lte(2000, 'Jumlah maksimal adalah 2000 ml')),
})

export default function Drink() {
  const form = useForm<z.infer<typeof drinkSchema>>({
    resolver: zodResolver(drinkSchema),
  })

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <CharacterBackground />
      <Navbar showCalendar />

      <main className="flex flex-1 flex-col items-center justify-between py-5">
        <Card className="w-full max-w-72 max-h-lg! h-full rounded-3xl">
          <CardHeader className="pb-0 pt-6">
            <CardTitle className="text-center text-xl font-bold text-slate-800">
              Catat Minum Mu!
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-6 pt-2 h-full"></CardContent>
        </Card>

        <DualStyleButton size="lg">Catat!</DualStyleButton>
      </main>

      <MobileNavigation />
    </div>
  )
}
