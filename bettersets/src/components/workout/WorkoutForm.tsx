'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2, Upload, X } from "lucide-react"
import { useState, useRef } from "react"
import { createWorkout, updateWorkout } from "@/services/workout.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Exercise } from "@prisma/client"
import ExercisePicker from "./ExercisePicker"
import SetInput from "./SetInput"
import { WorkoutWithExercises } from "@/types/workout"

const setSchema = z.object({
    setNumber: z.number(),
    reps: z.number().min(0, "Reps must be positive"),
    weight: z.number().min(0, "Weight must be positive").multipleOf(0.01, "Weight can only have up to 2 decimal places"),
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
    }),
    notes: z.string().optional(),
    imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    exercises: z.array(exerciseSchema),
})

interface WorkoutFormProps {
    userId: string
    exercises: Exercise[]
    initialData?: WorkoutWithExercises
    onCancel?: () => void
    onSuccess?: (workout: WorkoutWithExercises) => void
}

export default function WorkoutForm({ userId, exercises: allExercises, initialData, onCancel, onSuccess }: WorkoutFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            notes: initialData?.notes || "",
            imageUrl: (initialData as any)?.imageUrl || "",
            exercises: initialData?.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                name: ex.exercise.name,
                muscleGroup: ex.exercise.muscleGroup,
                sets: ex.sets.map(s => ({
                    setNumber: s.setNumber,
                    reps: s.reps,
                    weight: s.weight,
                    rpe: s.rpe ?? undefined,
                    isWarmup: s.isWarmup
                }))
            })) || [],
        },
    })

    const { register, control, handleSubmit, formState: { errors } } = form

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "exercises",
    })

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

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                throw new Error("Upload failed")
            }

            const data = await res.json()
            if (data.url) {
                form.setValue('imageUrl', data.url)
                toast.success("Photo uploaded!")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to upload photo.")
        } finally {
            setIsUploading(false)
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const clearImage = () => {
        form.setValue('imageUrl', '')
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const workoutData = {
                name: values.name,
                date: new Date(values.date),
                notes: values.notes,
                imageUrl: values.imageUrl,
                exercises: values.exercises.map((ex, index) => ({
                    exerciseId: ex.exerciseId,
                    order: index,
                    sets: ex.sets.map((set, setIndex) => ({
                        ...set,
                        setNumber: setIndex + 1,
                    }))
                }))
            }

            let result: WorkoutWithExercises

            if (initialData) {
                result = await updateWorkout(userId, {
                    id: initialData.id,
                    ...workoutData
                }) as unknown as WorkoutWithExercises // Cast for now as types might be slightly off in return
            } else {
                result = await createWorkout(userId, workoutData) as unknown as WorkoutWithExercises
            }

            toast.success(initialData ? "Workout updated successfully!" : "Workout created successfully!")

            if (onSuccess) {
                onSuccess(result)
            } else {
                router.push("/workouts")
                router.refresh()
            }
        } catch (error) {
            toast.error(initialData ? "Failed to update workout." : "Failed to create workout.")
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

                <div className="space-y-4">
                    <Label>Workout Photo</Label>

                    {form.watch('imageUrl') ? (
                        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border-2 border-black group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={form.watch('imageUrl')}
                                alt="Workout preview"
                                className="h-full w-full object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={clearImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 px-6 py-10 transition-colors hover:bg-muted/10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                {isUploading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                ) : (
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">Click to upload photo</p>
                                <p className="text-xs text-muted-foreground">Support for JPG, PNG, WEBP</p>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                    />

                    {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
                </div>
            </div>

            {/* Exercises Section */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">Exercises</h2>
                        <p className="text-sm text-muted-foreground">Add exercises and log your sets.</p>
                    </div>
                    <ExercisePicker exercises={allExercises} onSelect={addExercise}>
                        <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">Add Exercise</Button>
                    </ExercisePicker>
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
                <Button type="button" variant="outline" onClick={onCancel ? onCancel : () => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} size="lg">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Save Changes" : "Save Workout"}
                </Button>
            </div>

        </form>
    )
}
