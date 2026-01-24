'use client'

import { Exercise } from '@prisma/client'
import { useState } from 'react'
import { Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ExercisePickerProps {
    exercises: Exercise[]
    onSelect: (exercise: Exercise) => void
    children?: React.ReactNode // Trigger
}

export default function ExercisePicker({ exercises, onSelect, children }: ExercisePickerProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const categories = Array.from(new Set(exercises.map(e => e.category)))

    const filteredExercises = exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase()) ||
            exercise.muscleGroup.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    const handleSelect = (exercise: Exercise) => {
        onSelect(exercise)
        setOpen(false)
        setSearch('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button variant="outline">Add Exercise</Button>}
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-lg max-h-[85vh] h-[75vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-3 sm:p-4 pb-2 shrink-0">
                    <DialogTitle>Select Exercise</DialogTitle>
                </DialogHeader>

                <div className="px-3 sm:px-4 py-2 space-y-3 border-b shrink-0">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or muscle..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <Badge
                            variant={selectedCategory === null ? 'default' : 'outline'}
                            className="cursor-pointer whitespace-nowrap"
                            onClick={() => setSelectedCategory(null)}
                        >
                            All
                        </Badge>
                        {categories.map(cat => (
                            <Badge
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'outline'}
                                className="cursor-pointer whitespace-nowrap"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-1 sm:p-2">
                    {filteredExercises.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4 text-center">
                            <Search className="h-8 w-8 mb-2 opacity-20" />
                            <p>No exercises found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-1 sm:gap-2">
                            {filteredExercises.map(exercise => (
                                <button
                                    key={exercise.id}
                                    onClick={() => handleSelect(exercise)}
                                    className="w-full max-w-full min-w-0 flex items-center justify-between p-2 sm:p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-colors text-left group"
                                >
                                    <div className="min-w-0 flex-1 mr-2 sm:mr-4">
                                        <h4 className="font-semibold text-sm sm:text-base break-words leading-tight">{exercise.name}</h4>
                                        <div className="text-[10px] sm:text-xs text-muted-foreground flex flex-wrap gap-1.5 mt-1">
                                            <span className="capitalize">{exercise.muscleGroup}</span>
                                            <span>•</span>
                                            <span className="capitalize">{exercise.category}</span>
                                        </div>
                                    </div>
                                    <Check className="h-4 w-4 opacity-0 group-hover:opacity-50 text-primary shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent >
        </Dialog >
    )
}
