'use client'

import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

import { formSchema } from "./WorkoutForm"
import * as z from "zod"

// Needs to match the form schema in WorkoutForm
// exercises[exerciseIndex].sets
interface SetInputProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
    exerciseIndex: number
}

export default function SetInput({ form, exerciseIndex }: SetInputProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `exercises.${exerciseIndex}.sets`,
    })

    // Helper to add a set. If there's a previous set, copy its values.
    const addSet = () => {
        const currentSets = form.getValues(`exercises.${exerciseIndex}.sets`)
        const lastSet = currentSets.length > 0 ? currentSets[currentSets.length - 1] : null

        append({
            setNumber: fields.length + 1, // This will be recalculated on submit or render
            reps: lastSet ? lastSet.reps : 0,
            weight: lastSet ? lastSet.weight : 0,
            rpe: lastSet ? lastSet.rpe : 8,
            isWarmup: false,
        })
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-[30px_1fr_1fr_1fr_40px] gap-2 items-center text-xs font-medium text-muted-foreground text-center mb-1">
                <span>Set</span>
                <span>kg/lbs</span>
                <span>Reps</span>
                <span>RPE</span>
                <span></span>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[30px_1fr_1fr_1fr_40px] gap-2 items-center">
                    {/* Set Number Badge */}
                    <div className="flex justify-center">
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                            form.watch(`exercises.${exerciseIndex}.sets.${index}.isWarmup`)
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                : "bg-secondary text-secondary-foreground"
                        )}>
                            {index + 1}
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0"
                            {...form.register(`exercises.${exerciseIndex}.sets.${index}.weight`, { valueAsNumber: true })}
                            className="h-8 text-center p-1"
                        />
                    </div>

                    {/* Reps */}
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0"
                            {...form.register(`exercises.${exerciseIndex}.sets.${index}.reps`, { valueAsNumber: true })}
                            className="h-8 text-center p-1"
                        />
                    </div>

                    {/* RPE */}
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="8"
                            max={10}
                            {...form.register(`exercises.${exerciseIndex}.sets.${index}.rpe`, { valueAsNumber: true })}
                            className="h-8 text-center p-1"
                        />
                    </div>

                    {/* Actions Menu or Delete */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full mt-2 border-dashed border hover:bg-muted"
                onClick={addSet}
            >
                <Plus className="mr-2 h-3 w-3" />
                Add Set
            </Button>
        </div>
    )
}
