"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    TooltipProps
} from "recharts"

interface VolumeDataPoint {
    date: string
    volume: number
}

interface VolumeChartProps {
    data: VolumeDataPoint[]
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-card p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                        </span>
                        <span className="font-bold text-muted-foreground">
                            {label}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Volume
                        </span>
                        <span className="font-bold text-foreground">
                            {payload[0].value} lbs
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export function VolumeChart({ data }: VolumeChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-accent)", opacity: 0.2 }} />
                <Bar
                    dataKey="volume"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
