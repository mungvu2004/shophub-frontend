import { Line, LineChart, ResponsiveContainer } from 'recharts'

type TopProductsSparklineProps = {
  data: Array<{ value: number }>
  tone: 'up' | 'down'
}

export function TopProductsSparkline({ data, tone }: TopProductsSparklineProps) {
  const color = tone === 'up' ? '#10b981' : '#f43f5e'

  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
