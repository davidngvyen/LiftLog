"use client"

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    TooltipProps,
    DotProps,
} from "recharts"
import { Star } from "lucide-react"

export interface ProgressDataPoint {
    date: string | Date
    maxWeight: number
    totalVolume: number
    estimated1RM: number
}

interface ProgressChartProps {
    data: ProgressDataPoint[]
    metric?: 'maxWeight' | 'estimated1RM'
}

const CustomDot = (props: DotProps & { payload?: ProgressDataPoint }) => {
    const { cx, cy } = props

    return (
        <circle
            cx={cx}
            cy={cy}
            r={4}
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="var(--color-background)"
        />
    )
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as ProgressDataPoint
        return (
            <div className="rounded-lg border bg-card p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                        </span>
                        <span className="font-bold text-muted-foreground">
                            {new Date(label).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Weight
                        </span>
                        <span className="font-bold text-foreground">
                            {data.maxWeight} lbs
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Est. 1RM
                        </span>
                        <span className="font-bold text-foreground">
                            {Math.round(data.estimated1RM)} lbs
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Volume
                        </span>
                        <span className="font-bold text-muted-foreground">
                            {data.totalVolume} lbs
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export function ProgressChart({ data, metric = 'maxWeight' }: ProgressChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                <Line
                    type="monotone"
                    dataKey={metric}
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={<CustomDot />}
                    activeDot={{ r: 6, fill: "var(--color-primary)" }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
