'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Exercise } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, ChevronLeft, Plus, X, Trash2, GripVertical, Save, Dumbbell } from 'lucide-react'
import ExercisePicker from '@/components/workout/ExercisePicker'
import { toast } from 'sonner'

interface PlanWizardProps {
    exercises: Exercise[]
    initialData?: {
        id: string
        name: string
        description?: string | null
        days: {
            name: string
            exercises: {
                exerciseId: string
                exercise: Exercise
                sets: number
                reps?: number | null
                duration?: number | null
                notes?: string | null
                targetRpe?: number | null
            }[]
        }[]
    }
}

type PlanDay = {
    id: string // temporary ID for UI
    name: string
    exercises: PlanExercise[]
}

type PlanExercise = {
    id: string // temporary ID
    exerciseId: string
    exercise: Exercise
    sets: number
    reps?: number
    duration?: number // seconds
    notes?: string
}

export default function PlanWizard({ exercises, initialData }: PlanWizardProps) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Form State
    const [name, setName] = useState(initialData?.name || '')
    const [description, setDescription] = useState(initialData?.description || '')

    // Transform initial days to internal state format
    const initialDaysState = initialData?.days.map((d, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: d.name,
        exercises: d.exercises.map(ex => ({
            id: Math.random().toString(36).substr(2, 9),
            exerciseId: ex.exerciseId,
            exercise: ex.exercise,
            sets: ex.sets,
            reps: ex.reps || undefined,
            duration: ex.duration || undefined,
            notes: ex.notes || undefined,
            targetRpe: ex.targetRpe || undefined
        }))
    }))

    const [days, setDays] = useState<PlanDay[]>(initialDaysState || [
        { id: '1', name: 'Day 1', exercises: [] }
    ])

    const handleNext = () => {
        if (step === 1 && !name) {
            toast.error('Please enter a plan name')
            return
        }
        if (step === 2 && days.length === 0) {
            toast.error('Please add at least one day')
            return
        }
        if (step < 3) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const addDay = () => {
        const newDayId = Math.random().toString(36).substr(2, 9)
        setDays([...days, { id: newDayId, name: `Day ${days.length + 1}`, exercises: [] }])
    }

    const removeDay = (id: string) => {
        if (days.length <= 1) return
        setDays(days.filter(d => d.id !== id))
    }

    const updateDayName = (id: string, newName: string) => {
        setDays(days.map(d => d.id === id ? { ...d, name: newName } : d))
    }

    const addExerciseToDay = (dayId: string, exercise: Exercise) => {
        const newExercise: PlanExercise = {
            id: Math.random().toString(36).substr(2, 9),
            exerciseId: exercise.id,
            exercise,
            sets: 3,
            reps: 10
        }
        setDays(days.map(d => d.id === dayId ? { ...d, exercises: [...d.exercises, newExercise] } : d))
    }

    const removeExerciseFromDay = (dayId: string, exerciseTempId: string) => {
        setDays(days.map(d => d.id === dayId ? {
            ...d,
            exercises: d.exercises.filter(e => e.id !== exerciseTempId)
        } : d))
    }

    const updateExercise = (dayId: string, exerciseTempId: string, field: keyof PlanExercise, value: any) => {
        setDays(days.map(d => d.id === dayId ? {
            ...d,
            exercises: d.exercises.map(e => e.id === exerciseTempId ? { ...e, [field]: value } : e)
        } : d))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const payload = {
                name,
                description,
                days: days.map((day, index) => ({
                    name: day.name,
                    order: index,
                    exercises: day.exercises.map((ex, exIndex) => ({
                        exerciseId: ex.exerciseId,
                        order: exIndex,
                        sets: Number(ex.sets),
                        reps: ex.reps ? Number(ex.reps) : undefined,
                        duration: ex.duration,
                        notes: ex.notes
                    }))
                }))
            }

            const url = initialData ? `/api/workout-plans/${initialData.id}` : '/api/workout-plans'
            const method = initialData ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error(initialData ? 'Failed to update plan' : 'Failed to create plan')

            toast.success(initialData ? 'Plan updated!' : 'Workout plan created!')
            router.push('/plans')
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to create plan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Steps Indicator */}
            <div className="flex items-center space-x-4 text-sm">
                <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border mr-2 ${step >= 1 ? 'bg-primary text-primary-foreground border-primary' : ''}`}>1</span>
                    Basic Info
                </div>
                <div className="h-px w-8 bg-border" />
                <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border mr-2 ${step >= 2 ? 'bg-primary text-primary-foreground border-primary' : ''}`}>2</span>
                    Define Days
                </div>
                <div className="h-px w-8 bg-border" />
                <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border mr-2 ${step >= 3 ? 'bg-primary text-primary-foreground border-primary' : ''}`}>3</span>
                    Add Exercises
                </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Plan Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Plan Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Push Pull Legs"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your plan goals..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleNext}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 2: Define Days */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Days in Rotation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {days.map((day, index) => (
                            <div key={day.id} className="flex items-center gap-3">
                                <span className="text-muted-foreground font-mono w-6 text-center">{index + 1}</span>
                                <Input
                                    value={day.name}
                                    onChange={(e) => updateDayName(day.id, e.target.value)}
                                    placeholder={`Day ${index + 1}`}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                    onClick={() => removeDay(day.id)}
                                    disabled={days.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full dashed" onClick={addDay}>
                            <Plus className="mr-2 h-4 w-4" /> Add Day
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" onClick={handleBack}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleNext}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 3: Add Exercises */}
            {step === 3 && (
                <div className="space-y-6">
                    {days.map((day) => (
                        <Card key={day.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center text-lg">
                                    {day.name}
                                    <ExercisePicker exercises={exercises} onSelect={(ex) => addExerciseToDay(day.id, ex)}>
                                        <Button size="sm" variant="secondary">
                                            <Plus className="mr-2 h-4 w-4" /> Add Exercise
                                        </Button>
                                    </ExercisePicker>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {day.exercises.length === 0 ? (
                                    <div className="text-center py-6 border-2 border-dashed rounded-lg text-muted-foreground">
                                        <Dumbbell className="mx-auto h-8 w-8 mb-2 opacity-20" />
                                        <p>No exercises yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {day.exercises.map((ex, index) => (
                                            <div key={ex.id} className="bg-muted/40 p-3 rounded-md flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-background w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono border">
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-medium">{ex.exercise.name}</span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeExerciseFromDay(day.id, ex.id)}>
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex gap-4 ml-8">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs">Sets</Label>
                                                        <Input
                                                            type="number"
                                                            className="h-7 w-16"
                                                            value={ex.sets}
                                                            onChange={(e) => updateExercise(day.id, ex.id, 'sets', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs">Reps</Label>
                                                        <Input
                                                            type="number"
                                                            className="h-7 w-16"
                                                            value={ex.reps || ''}
                                                            onChange={(e) => updateExercise(day.id, ex.id, 'reps', e.target.value)}
                                                            placeholder="-"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs">Seconds</Label>
                                                        <Input
                                                            type="number"
                                                            className="h-7 w-16"
                                                            value={ex.duration || ''}
                                                            onChange={(e) => updateExercise(day.id, ex.id, 'duration', e.target.value)}
                                                            placeholder="-"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-between py-4">
                        <Button variant="ghost" onClick={handleBack}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleSave} disabled={loading} size="lg">
                            {loading ? 'Saving...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Plan
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
