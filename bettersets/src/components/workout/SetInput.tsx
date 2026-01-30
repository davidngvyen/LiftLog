'use client'

import * as React from "react"
import { Trash2, Plus } from "lucide-react"
import { UseFormReturn, useFieldArray, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SetInputProps {
    form: UseFormReturn<any> // Using any to avoid circular dependency with schema
    exerciseIndex: number
    className?: string
}

interface ControlledNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    control: any
    name: string
    onEnter?: () => void
}

function ControlledNumberInput({ control, name, onEnter, className, ...props }: ControlledNumberInputProps) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, onBlur } }) => {
                // We use local state to track exactly what the user types (e.g. "1.")
                // while syncing the parsed number to the form.
                const [localValue, setLocalValue] = React.useState<string>(value?.toString() ?? "")

                // Sync local value when form value changes externally (e.g. initial load or reset)
                React.useEffect(() => {
                    if (value === undefined || value === null) {
                        setLocalValue("")
                    } else {
                        // Only update if the parsed local value doesn't match the form value
                        // This prevents jumping cursor/format when typing e.g. "1.0" vs "1"
                        if (parseFloat(localValue) !== value) {
                            setLocalValue(value.toString())
                        }
                    }
                }, [value])

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = e.target.value
                    setLocalValue(rawValue)

                    if (rawValue === "") {
                        onChange(0) // Default to 0 if empty
                        return
                    }

                    const parsed = parseFloat(rawValue)
                    if (!isNaN(parsed)) {
                        onChange(parsed)
                    }
                }

                const handleBlur = () => {
                    onBlur()
                    // On blur, normalize the display value
                    if (value !== undefined && value !== null) {
                        setLocalValue(value.toString())
                    }
                }

                const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        onEnter?.()
                    }
                }

                return (
                    <Input
                        {...props}
                        className={className}
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />
                )
            }}
        />
    )
}

export default function SetInput({ form, exerciseIndex, className }: SetInputProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `exercises.${exerciseIndex}.sets`
    })

    const { control, getValues } = form

    const handleAddSet = () => {
        const currentSets = getValues(`exercises.${exerciseIndex}.sets`)
        const lastSet = currentSets && currentSets.length > 0 ? currentSets[currentSets.length - 1] : null;

        append({
            setNumber: fields.length + 1,
            reps: lastSet ? Number(lastSet.reps) : 0,
            weight: lastSet ? Number(lastSet.weight) : 0,
            rpe: lastSet ? lastSet.rpe : 8,
            isWarmup: lastSet ? lastSet.isWarmup : false
        })
    }

    return (
        <div className={cn("space-y-3 mt-4", className)}>
            {/* Header - hidden on mobile, visible on sm+ */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2 px-1">
                <div className="w-8 text-center">Set</div>
                <div className="flex-1">Weight</div>
                <div className="flex-1">Reps</div>
                <div className="w-16">RPE</div>
                <div className="w-20 text-center">Warmup</div>
                <div className="w-8"></div>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-3 sm:p-0 sm:border-0">
                    {/* Mobile layout: stacked */}
                    <div className="sm:hidden space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Set {index + 1}</span>
                            <div className="flex items-center gap-2">
                                <Controller
                                    control={control}
                                    name={`exercises.${exerciseIndex}.sets.${index}.isWarmup`}
                                    defaultValue={(field as any).isWarmup}
                                    render={({ field }) => (
                                        <label className="flex items-center gap-1.5 text-xs">
                                            <Checkbox
                                                id={`warmup-mobile-${index}`}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            Warmup
                                        </label>
                                    )}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    tabIndex={-1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs text-muted-foreground">Weight</label>
                                <ControlledNumberInput
                                    control={control}
                                    name={`exercises.${exerciseIndex}.sets.${index}.weight`}
                                    placeholder="0"
                                    type="number"
                                    step="0.01"
                                    className="h-10"
                                    onEnter={handleAddSet}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Reps</label>
                                <ControlledNumberInput
                                    control={control}
                                    name={`exercises.${exerciseIndex}.sets.${index}.reps`}
                                    placeholder="0"
                                    type="number"
                                    className="h-10"
                                    onEnter={handleAddSet}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">RPE</label>
                                <Controller
                                    control={control}
                                    name={`exercises.${exerciseIndex}.sets.${index}.rpe`}
                                    defaultValue={(field as any).rpe}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value?.toString()}
                                            onValueChange={(val) => field.onChange(val ? parseInt(val) : undefined)}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="-" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">-</SelectItem>
                                                {[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5].map((val) => (
                                                    <SelectItem key={val} value={val.toString()}>
                                                        {val}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop layout: row */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="flex h-10 w-8 items-center justify-center text-sm text-muted-foreground">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <ControlledNumberInput
                                control={control}
                                name={`exercises.${exerciseIndex}.sets.${index}.weight`}
                                placeholder="Weight"
                                type="number"
                                step="0.01"
                                onEnter={handleAddSet}
                            />
                        </div>
                        <div className="flex-1">
                            <ControlledNumberInput
                                control={control}
                                name={`exercises.${exerciseIndex}.sets.${index}.reps`}
                                placeholder="Reps"
                                type="number"
                                onEnter={handleAddSet}
                            />
                        </div>
                        <div className="w-16">
                            <Controller
                                control={control}
                                name={`exercises.${exerciseIndex}.sets.${index}.rpe`}
                                defaultValue={(field as any).rpe}
                                render={({ field }) => (
                                    <Select
                                        value={field.value?.toString()}
                                        onValueChange={(val) => field.onChange(val ? parseInt(val) : undefined)}
                                    >
                                        <SelectTrigger tabIndex={-1}>
                                            <SelectValue placeholder="-" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">-</SelectItem>
                                            {[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5].map((val) => (
                                                <SelectItem key={val} value={val.toString()}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="w-20 flex items-center justify-center">
                            <Controller
                                control={control}
                                name={`exercises.${exerciseIndex}.sets.${index}.isWarmup`}
                                defaultValue={(field as any).isWarmup}
                                render={({ field }) => (
                                    <Checkbox
                                        id={`warmup-${index}`}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="w-8 text-muted-foreground hover:text-destructive"
                            tabIndex={-1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={handleAddSet}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Set
            </Button>
        </div>
    )
}
