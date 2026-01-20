'use client'

import { useState } from "react"
import { WorkoutWithExercises } from "@/types/workout"
import { Exercise } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, Edit2, ChevronLeft } from "lucide-react"
// import { format } from "date-fns" // Avoid date-fns if not already installed, use native intl
import Link from "next/link"
import WorkoutForm from "@/components/workout/WorkoutForm"
import { Badge } from "@/components/ui/badge"

interface WorkoutDetailsClientProps {
    workout: WorkoutWithExercises
    allExercises: Exercise[]
    userId: string
}

export default function WorkoutDetailsClient({ workout: initialWorkout, allExercises, userId }: WorkoutDetailsClientProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [workout, setWorkout] = useState<WorkoutWithExercises>(initialWorkout)

    const handleUpdateSuccess = (updatedWorkout: WorkoutWithExercises) => {
        setWorkout(updatedWorkout)
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="container mx-auto py-6 max-w-2xl">
                <div className="mb-6">
                    <Button variant="ghost" className="pl-0 gap-2" onClick={() => setIsEditing(false)}>
                        <ChevronLeft className="h-4 w-4" />
                        Back to Details
                    </Button>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Workout</h1>
                <WorkoutForm
                    userId={userId}
                    exercises={allExercises}
                    initialData={workout}
                    onCancel={() => setIsEditing(false)}
                    onSuccess={handleUpdateSuccess}
                />
            </div>
        )
    }

    // Read Mode
    return (
        <div className="container mx-auto py-8 max-w-3xl space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Link href="/workouts" className="hover:text-foreground transition-colors">
                            &larr; Back to Workouts
                        </Link>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">{workout.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        {/* Add duration if available or calculated */}
                    </div>
                </div>
                <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Workout
                </Button>
            </div>

            {/* Notes */}
            {workout.notes && (
                <div className="bg-muted/30 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold mb-1 text-muted-foreground uppercase tracking-wider">Notes</h3>
                    <p className="whitespace-pre-wrap">{workout.notes}</p>
                </div>
            )}

            {/* Exercises List */}
            <div className="space-y-6">
                {workout.exercises.map((workoutExercise) => (
                    <div key={workoutExercise.id} className="border rounded-xl bg-card overflow-hidden shadow-sm">
                        <div className="bg-muted/40 p-4 border-b flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{workoutExercise.exercise.name}</h3>
                                <div className="text-xs text-muted-foreground capitalize">{workoutExercise.exercise.muscleGroup}</div>
                            </div>
                            {/* <Badge variant="secondary">Order: {workoutExercise.order + 1}</Badge> */}
                        </div>
                        <div className="p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/10">
                                    <tr className="border-b">
                                        <th className="text-left font-medium text-muted-foreground py-2 px-4 w-12 text-center">Set</th>
                                        <th className="text-left font-medium text-muted-foreground py-2 px-4 text-center">kg</th>
                                        <th className="text-left font-medium text-muted-foreground py-2 px-4 text-center">Reps</th>
                                        <th className="text-left font-medium text-muted-foreground py-2 px-4 text-center">RPE</th>
                                        <th className="text-left font-medium text-muted-foreground py-2 px-4 w-20 text-center">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workoutExercise.sets.map((set, index) => (
                                        <tr key={set.id} className="border-b last:border-0 hover:bg-muted/5 transition-colors">
                                            <td className="py-3 px-4 text-center font-medium text-muted-foreground">{index + 1}</td>
                                            <td className="py-3 px-4 text-center font-semibold">{set.weight}</td>
                                            <td className="py-3 px-4 text-center font-semibold">{set.reps}</td>
                                            <td className="py-3 px-4 text-center text-muted-foreground">{set.rpe ?? '-'}</td>
                                            <td className="py-3 px-4 text-center">
                                                {set.isWarmup ? (
                                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Warmup</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-transparent bg-primary/10 text-primary">Working</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {workout.exercises.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No exercises recorded for this workout.
                    </div>
                )}
            </div>
        </div>
    )
}
