"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Dumbbell, Scale, Activity } from "lucide-react"

interface PersonalRecordsCardProps {
    maxWeight: number
    maxVolume: number
    best1RM: number
}

export function PersonalRecordsCard({ maxWeight, maxVolume, best1RM }: PersonalRecordsCardProps) {
    return (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 uppercase text-lg">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Personal Records
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Max Weight */}
                    <div className="flex flex-col p-4 rounded-xl border-2 border-black bg-accent/10 hover:bg-accent/20 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Dumbbell className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold uppercase text-muted-foreground">Max Weight</span>
                        </div>
                        <span className="text-2xl font-black font-mono tracking-tight">{maxWeight} <span className="text-sm font-normal text-muted-foreground">lbs</span></span>
                    </div>

                    {/* Best 1RM */}
                    <div className="flex flex-col p-4 rounded-xl border-2 border-black bg-accent/10 hover:bg-accent/20 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Scale className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold uppercase text-muted-foreground">Best 1RM (Est)</span>
                        </div>
                        <span className="text-2xl font-black font-mono tracking-tight">{Math.round(best1RM)} <span className="text-sm font-normal text-muted-foreground">lbs</span></span>
                    </div>

                    {/* Max Volume */}
                    <div className="flex flex-col p-4 rounded-xl border-2 border-black bg-accent/10 hover:bg-accent/20 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold uppercase text-muted-foreground">Max Volume</span>
                        </div>
                        <span className="text-2xl font-black font-mono tracking-tight">{maxVolume.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">lbs</span></span>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}
