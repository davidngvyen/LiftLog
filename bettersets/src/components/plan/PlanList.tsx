'use client'

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Calendar, Check, Pencil } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Plan = {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    days: {
        id: string
        name: string
        _count: { exercises: number }
    }[]
}

interface PlanListProps {
    plans: any[] // Using any for simplicity with complex Prisma types, ideally define proper type
    activePlanId: string | null
}

export default function PlanList({ plans, activePlanId }: PlanListProps) {
    const router = useRouter()
    const [activating, setActivating] = useState<string | null>(null)

    const handleActivate = async (planId: string) => {
        setActivating(planId)
        try {
            const res = await fetch('/api/workout-plans/active', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            })

            if (!res.ok) throw new Error('Failed to activate plan')

            toast.success('Plan activated!')
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setActivating(null)
        }
    }

    if (plans.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't created any plans yet.</p>
                <Button variant="outline" asChild>
                    <a href="/plans/new">Create your first plan</a>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
                const isActive = activePlanId === plan.id
                return (
                    <Card key={plan.id} className={`flex flex-col ${isActive ? 'border-primary' : ''}`}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 mt-1">
                                        {plan.description || "No description"}
                                    </CardDescription>
                                </div>
                                {isActive && (
                                    <Badge variant="default" className="ml-2 whitespace-nowrap">
                                        Active
                                    </Badge>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-muted-foreground/50 hover:text-foreground" asChild>
                                <Link href={`/plans/${plan.id}/edit`}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Schedule ({plan.days.length} days)</h4>
                                <div className="space-y-1">
                                    {plan.days.slice(0, 3).map((day: any, i: number) => (
                                        <div key={day.id} className="text-sm flex justify-between items-center bg-secondary/30 p-2 rounded-md">
                                            <span>{i + 1}. {day.name}</span>
                                            <span className="text-xs text-muted-foreground">{day.exercises.length} exercises</span>
                                        </div>
                                    ))}
                                    {plan.days.length > 3 && (
                                        <div className="text-xs text-muted-foreground text-center pt-1">
                                            + {plan.days.length - 3} more days
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            {isActive ? (
                                <Button className="w-full" variant="secondary" disabled>
                                    <Check className="mr-2 h-4 w-4" />
                                    Current Plan
                                </Button>
                            ) : (
                                <Button
                                    className="w-full"
                                    onClick={() => handleActivate(plan.id)}
                                    disabled={!!activating}
                                >
                                    {activating === plan.id ? "Activating..." : (
                                        <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Start Plan
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
