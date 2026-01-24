'use client'

import { Exercise } from '@prisma/client'
import { useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
            <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-md w-full h-[100dvh] sm:h-[80vh] max-w-none rounded-none sm:rounded-xl overflow-hidden">
                <DialogHeader className="px-4 py-3 border-b flex flex-row items-center justify-between shrink-0">
                    <DialogTitle className="text-base font-semibold">Add Exercise</DialogTitle>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="px-4 py-3 space-y-3 border-b bg-muted/20 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-background"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
                        <Badge
                            variant={selectedCategory === null ? 'default' : 'outline'}
                            className="cursor-pointer whitespace-nowrap shrink-0 min-h-[32px] flex items-center"
                            onClick={() => setSelectedCategory(null)}
                        >
                            All
                        </Badge>
                        {categories.map(cat => (
                            <Badge
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'outline'}
                                className="cursor-pointer whitespace-nowrap shrink-0 min-h-[32px] flex items-center"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 sm:p-4">
                    {filteredExercises.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4 text-center">
                            <Search className="h-8 w-8 mb-2 opacity-20" />
                            <p>No exercises found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {filteredExercises.map(exercise => (
                                <button
                                    key={exercise.id}
                                    type="button"
                                    onClick={() => handleSelect(exercise)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary hover:bg-accent/50 transition-all text-left group min-h-[56px] active:scale-[0.99]"
                                >
                                    <div className="min-w-0 flex-1 mr-3">
                                        <h4 className="font-semibold text-sm break-words leading-tight">{exercise.name}</h4>
                                        <div className="text-xs text-muted-foreground flex flex-wrap gap-1.5 mt-1">
                                            <span className="capitalize">{exercise.muscleGroup}</span>
                                            <span>•</span>
                                            <span className="capitalize">{exercise.category}</span>
                                        </div>
                                    </div>
                                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center group-hover:border-primary text-primary transition-colors">
                                        <Check className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
