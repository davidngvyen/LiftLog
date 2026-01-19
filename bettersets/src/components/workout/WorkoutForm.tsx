'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
// import { format } from "date-fns" // Removed date-fns usage for input type=date
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { createWorkout } from "@/services/workout.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Exercise } from "@prisma/client"
import ExercisePicker from "./ExercisePicker"
import SetInput from "./SetInput"

const setSchema = z.object({
    setNumber: z.number(),
    reps: z.number().min(0, "Reps must be positive"),
    weight: z.number().min(0, "Weight must be positive"),
    rpe: z.number().optional(),
    isWarmup: z.boolean(),
})

const exerciseSchema = z.object({
    exerciseId: z.string(),
    name: z.string(),
    muscleGroup: z.string(),
    sets: z.array(setSchema).min(1, "At least one set is required"),
})

export const formSchema = z.object({
    name: z.string().min(2, "Workout name must be at least 2 characters."),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date"
    }), // Changed to string for native input
    notes: z.string().optional(),
    exercises: z.array(exerciseSchema),
})

interface WorkoutFormProps {
    userId: string
    exercises: Exercise[]
}

export default function WorkoutForm({ userId, exercises: allExercises }: WorkoutFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            date: new Date().toISOString().split('T')[0],
            notes: "",
            exercises: [],
        },
    })

    const { register, control, handleSubmit, formState: { errors } } = form

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "exercises",
    })

    // We need to keep track of exercise details for display purposes since useFieldArray only keeps the values in form state
    // Actually fields contains the default values, but controlled inputs update the form state.
    // We can just rely on the form state values or the fields if they are static.
    // We'll store name/muscleGroup in hidden fields or just sync them. Schema has them so they are in 'fields'.

    const addExercise = (exercise: Exercise) => {
        append({
            exerciseId: exercise.id,
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            sets: [
                { setNumber: 1, reps: 0, weight: 0, rpe: 8, isWarmup: false }
            ]
        })
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            await createWorkout(userId, {
                name: values.name,
                date: new Date(values.date),
                notes: values.notes,
                exercises: values.exercises.map((ex, index) => ({
                    exerciseId: ex.exerciseId,
                    order: index,
                    sets: ex.sets.map((set, setIndex) => ({
                        ...set,
                        setNumber: setIndex + 1,
                    }))
                }))
            })

            toast.success("Workout created successfully!")
            router.push("/workouts")
            router.refresh()
        } catch (error) {
            toast.error("Failed to create workout.")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-background pb-20">

            {/* Basic Info Section */}
            <div className="space-y-6 bg-card p-6 rounded-xl border">
                <div>
                    <h2 className="text-xl font-semibold">Basic Info</h2>
                    <p className="text-sm text-muted-foreground">General details about this session.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Workout Name</Label>
                        <Input id="name" placeholder="e.g. Push Day" {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register("date")}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        placeholder="How did it feel?"
                        className="resize-none"
                        {...register("notes")}
                    />
                </div>
            </div>

            {/* Exercises Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Exercises</h2>
                        <p className="text-sm text-muted-foreground">Add exercises and log your sets.</p>
                    </div>
                    <ExercisePicker exercises={allExercises} onSelect={addExercise} />
                </div>

                <div className="space-y-4">
                    {fields.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl opacity-50">
                            <p>No exercises added yet.</p>
                            <p className="text-sm">Click &quot;Add Exercise&quot; to get started.</p>
                        </div>
                    ) : (
                        fields.map((field, index) => (
                            <div key={field.id} className="bg-card p-6 rounded-xl border relative group">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <div className="bg-primary/20 text-primary w-6 h-6 rounded flex items-center justify-center text-xs">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            {field.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground capitalize pl-8">{field.muscleGroup}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <SetInput form={form} exerciseIndex={index} />
                            </div>
                        ))
                    )}
                </div>
                {errors.exercises && <p className="text-sm text-destructive text-center">{errors.exercises.message}</p>}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} size="lg">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Workout
                </Button>
            </div>

        </form>
    )
}
