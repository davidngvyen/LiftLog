"use client"

import React, { useState, useEffect, useMemo } from "react"
import { TrendingUp, BarChart3, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressChart, ProgressDataPoint } from "@/components/charts/ProgressChart"
import { VolumeChart } from "@/components/charts/VolumeChart"
import { PersonalRecordsCard } from "@/components/progress/PersonalRecordsCard"
import { DateRangeSelector, DateRange } from "@/components/progress/DateRangeSelector"
import ExercisePicker from "@/components/workout/ExercisePicker"
import { Button } from "@/components/ui/button"
import { Exercise } from "@prisma/client"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ProgressDashboardProps {
    initialExercises: Exercise[]
}

export function ProgressDashboard({ initialExercises }: ProgressDashboardProps) {
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(initialExercises[0] || null)
    const [dateRange, setDateRange] = useState<DateRange>('3M')
    const [data, setData] = useState<ProgressDataPoint[]>([])
    const [loading, setLoading] = useState(false)
    const [metric, setMetric] = useState<'maxWeight' | 'estimated1RM'>('maxWeight')

    useEffect(() => {
        if (!selectedExercise) return

        async function fetchData() {
            setLoading(true)
            try {
                const res = await fetch(`/api/progress/${selectedExercise?.id}`)
                if (res.ok) {
                    const jsonData = await res.json()
                    setData(jsonData)
                }
            } catch (error) {
                console.error("Failed to fetch progress", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [selectedExercise])

    const filteredData = useMemo(() => {
        if (!data.length) return []

        const now = new Date()
        let startDate = new Date(0) // Beginning of time

        switch (dateRange) {
            case '1M':
                startDate = new Date(now.setMonth(now.getMonth() - 1))
                break
            case '3M':
                startDate = new Date(now.setMonth(now.getMonth() - 3))
                break
            case '6M':
                startDate = new Date(now.setMonth(now.getMonth() - 6))
                break
            case '1Y':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1))
                break
            case 'ALL':
            default:
                break
        }

        return data.filter(d => new Date(d.date) >= startDate)
    }, [data, dateRange])

    const stats = useMemo(() => {
        if (!data.length) return { maxWeight: 0, maxVolume: 0, best1RM: 0 }

        const maxWeight = Math.max(...data.map(d => d.maxWeight))
        const maxVolume = Math.max(...data.map(d => d.totalVolume))
        const best1RM = Math.max(...data.map(d => d.estimated1RM))

        return { maxWeight, maxVolume, best1RM }
    }, [data])

    const volumeData = useMemo(() => {
        return filteredData.map(d => ({
            date: new Date(d.date).toLocaleDateString(),
            volume: d.totalVolume
        }))
    }, [filteredData])

    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold uppercase">Progress Tracking</h1>
                    <p className="text-muted-foreground uppercase text-xs">Monitor your improvements over time</p>
                </div>

                <ExercisePicker exercises={initialExercises} onSelect={setSelectedExercise}>
                    <Button variant="outline" className="w-full sm:w-auto min-w-[200px] justify-between border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <span className="truncate">{selectedExercise?.name || "Select Exercise"}</span>
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </ExercisePicker>
            </div>

            {/* Date Range Selector */}
            <div className="flex justify-end">
                <DateRangeSelector selected={dateRange} onSelect={setDateRange} />
            </div>

            {/* Personal Records */}
            <PersonalRecordsCard
                maxWeight={stats.maxWeight}
                maxVolume={stats.maxVolume}
                best1RM={stats.best1RM}
            />

            {/* Main Progress Chart */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="flex items-center gap-2 uppercase">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        {selectedExercise?.name} Progress
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="metric-mode" className="text-xs uppercase font-bold text-muted-foreground">Est. 1RM</Label>
                        <Switch
                            id="metric-mode"
                            checked={metric === 'estimated1RM'}
                            onCheckedChange={(c) => setMetric(c ? 'estimated1RM' : 'maxWeight')}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground animate-pulse">
                                Loading...
                            </div>
                        ) : filteredData.length > 0 ? (
                            <ProgressChart data={filteredData} metric={metric} />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                No data available for this period
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Volume Chart */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 uppercase">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        Volume History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground animate-pulse">
                                Loading...
                            </div>
                        ) : filteredData.length > 0 ? (
                            <VolumeChart data={volumeData} />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                No data available for this period
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
