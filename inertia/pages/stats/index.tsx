import { CharacterBackground } from '@/components/background/character-background'
import { Navbar } from '@/components/layout/navbar'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

const WEEKDAY_ID: Record<string, string> = {
  Monday: 'Sen',
  Tuesday: 'Sel',
  Wednesday: 'Rab',
  Thursday: 'Kam',
  Friday: 'Jum',
  Saturday: 'Sab',
  Sunday: 'Min',
}

const MONTH_ID: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agu',
  '09': 'Sep',
  '10': 'Okt',
  '11': 'Nov',
  '12': 'Des',
}

const barColors = ['#FFD966', '#FF7C88', '#CE93D8', '#F48FB1', '#5EE0C7']

const chartConfig = {
  total_ml: {
    label: 'Total (ml)',
  },
} satisfies ChartConfig

export default function StatsIndex({
  groupBy,
  weeklyChartData,
  monthlyChartData,
}: InertiaProps<{
  month: number
  groupBy: 'month' | 'year'
  perMonthData: Data.Drink
  perYearData: Data.Drink
  weeklyChartData: Array<{ day: string; total_ml: number }>
  monthlyChartData: Array<{ month: string; total_ml: number }>
}>) {
  const weeklyData = weeklyChartData.map((d) => ({
    ...d,
    label: WEEKDAY_ID[d.day] ?? d.day,
  }))

  const monthlyData = monthlyChartData.map((d) => ({
    ...d,
    label: MONTH_ID[d.month.slice(5)] ?? d.month,
  }))

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <CharacterBackground />

      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-5">
        <section className="max-w-md w-full rounded-lg bg-white p-8">
          <Tabs defaultValue={groupBy}>
            <TabsList>
              <TabsTrigger value="month">Per Minggu</TabsTrigger>
              <TabsTrigger value="year">Per Bulan</TabsTrigger>
            </TabsList>

            <TabsContent value="month">
              <Card className="w-full rounded-2xl border-none bg-slate-50 shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    Konsumsi per Hari
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ChartContainer config={chartConfig} className="h-55 w-full">
                    <BarChart
                      data={weeklyData}
                      margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                      />
                      <YAxis hide />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Bar dataKey="total_ml" radius={[10, 10, 10, 10]} maxBarSize={40}>
                        {weeklyData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.day}`}
                            fill={barColors[index % barColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="year">
              <Card className="w-full rounded-2xl border-none bg-slate-50 shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    Konsumsi per Bulan
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ChartContainer config={chartConfig} className="h-55 w-full">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
                      barCategoryGap="10%"
                    >
                      <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                      />
                      <YAxis hide />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Bar dataKey="total_ml" radius={[6, 6, 6, 6]}>
                        {monthlyData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.month}`}
                            fill={barColors[index % barColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}
