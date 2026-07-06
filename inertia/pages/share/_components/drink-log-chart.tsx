import { useMemo } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'

import type { Data } from '@generated/data'

function CustomDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null
  return (
    <svg x={cx - 4} y={cy - 4} width={8} height={8} viewBox="0 0 8 8">
      <path d="M 4 0 L 8 4 L 4 8 L 0 4 Z" fill="#3b82f6" />
    </svg>
  )
}

function CustomActiveDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null

  return (
    <svg x={cx - 6} y={cy - 6} width={12} height={12} viewBox="0 0 12 12">
      <circle cx={6} cy={6} r={4} fill="#2563eb" stroke="#ffffff" strokeWidth={2} />
    </svg>
  )
}

export function DrinkLogChart({
  todayLogs,
  height = 96,
  maxHeight,
}: {
  todayLogs: Data.DrinkLog[]
  height?: number | string
  maxHeight?: number | string
}) {
  const chartData = useMemo(() => {
    return todayLogs.map((log) => ({
      amountMl: log.amountMl,
      time: new Date(log.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))
  }, [todayLogs])

  if (chartData.length === 0) {
    return (
      <div
        className="w-full my-1 flex items-center justify-center rounded-2xl p-2 relative overflow-hidden"
        style={{ height, maxHeight }}
      >
        <div className="flex flex-col items-center justify-center text-gray-500/80 text-[11px] gap-1">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>No logs today</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full my-1 flex items-center justify-center rounded-2xl p-2 relative overflow-hidden"
      style={{ height, maxHeight }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white/90 backdrop-blur-xs border border-gray-200/80 px-2 py-1 rounded-lg shadow-md text-[10px] font-semibold text-gray-800">
                    <div>{data.amountMl} ml</div>
                    <div className="text-[8px] text-gray-500 font-normal">{data.time}</div>
                  </div>
                )
              }
              return null
            }}
            cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Line
            type="linear"
            dataKey="amountMl"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={<CustomActiveDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
