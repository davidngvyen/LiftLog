'use client'

import WorkoutForm from "@/components/workout/WorkoutForm"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { WorkoutWithExercises } from "@/types/workout"
import { Exercise } from "@prisma/client"

interface NewWorkoutClientProps {
    userId: string
    exercises: Exercise[]
    templateData?: Partial<WorkoutWithExercises>
    advanceActivePlan: boolean
    userPlans: { id: string; name: string }[]
    targetPlanId?: string
    planName?: string
    dayName?: string
}

export default function NewWorkoutClient({
    userId,
    exercises,
    templateData,
    advanceActivePlan,
    userPlans,
    targetPlanId,
    planName,
    dayName
}: NewWorkoutClientProps) {
    const router = useRouter()

    const handlePlanChange = (value: string) => {
        if (value === "none") {
            router.push("/workouts/new")
        } else {
            router.push(`/workouts/new?planId=${value}`)
        }
    }

    return (
        <div className="container mx-auto py-6 max-w-2xl">
            <div className="mb-8 flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Workout</h1>
                    <p className="text-muted-foreground mt-1">
                        {planName
                            ? `Up next: ${dayName} (${planName})`
                            : "Plan your session or log a workout you just finished."
                        }
                    </p>
                </div>

                {/* Plan Selector */}
                <div className="w-full max-w-xs">
                    <div className="mb-2 text-sm font-medium">Select Plan to Follow</div>
                    {userPlans.length > 0 ? (
                        <Select
                            defaultValue={targetPlanId || "none"}
                            onValueChange={handlePlanChange}
                        >
                            <SelectTrigger className="w-full bg-background">
                                <SelectValue placeholder="Select a plan..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None (Empty Workout)</SelectItem>
                                {userPlans.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            No plans created yet. <a href="/plans/new" className="underline hover:text-foreground">Create one?</a>
                        </div>
                    )}
                </div>
            </div>

            <WorkoutForm
                userId={userId}
                exercises={exercises}
                templateData={templateData as any}
                advanceActivePlan={advanceActivePlan}
            />
        </div>
    )
}
