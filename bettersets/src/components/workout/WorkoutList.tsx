'use client'

import { WorkoutWithExercises } from '@/types/workout'
import WorkoutCard from './WorkoutCard'
import { Dumbbell, Plus, Filter, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface WorkoutListProps {
    workouts: WorkoutWithExercises[]
}

type FilterStatus = 'ALL' | 'COMPLETED' | 'PLANNED'
type SortOrder = 'NEWEST' | 'OLDEST'

export default function WorkoutList({ workouts }: WorkoutListProps) {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL')
    const [sortOrder, setSortOrder] = useState<SortOrder>('NEWEST')

    const filteredAndSortedWorkouts = useMemo(() => {
        let result = [...workouts]

        // Filter
        if (statusFilter !== 'ALL') {
            result = result.filter(w => {
                if (statusFilter === 'COMPLETED') return w.isCompleted
                if (statusFilter === 'PLANNED') return !w.isCompleted
                return true
            })
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB
        })

        return result
    }, [workouts, statusFilter, sortOrder])

    if (workouts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-card border-dashed">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Dumbbell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No workouts found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    You haven't logged any workouts yet. Start your journey by creating your first workout!
                </p>
                <Button asChild className="w-full sm:w-auto min-h-[44px]">
                    <Link href="/workouts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Workout
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col gap-3 bg-card p-3 sm:p-4 rounded-xl border">
                {/* Filter badges - scrollable on mobile */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex gap-2 overflow-x-auto scrollbar-none">
                        <Badge
                            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-primary/80 min-h-[36px] px-4 flex items-center shrink-0"
                            onClick={() => setStatusFilter('ALL')}
                        >
                            All
                        </Badge>
                        <Badge
                            variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-primary/80 min-h-[36px] px-4 flex items-center shrink-0"
                            onClick={() => setStatusFilter('COMPLETED')}
                        >
                            Completed
                        </Badge>
                        <Badge
                            variant={statusFilter === 'PLANNED' ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-primary/80 min-h-[36px] px-4 flex items-center shrink-0"
                            onClick={() => setStatusFilter('PLANNED')}
                        >
                            Planned
                        </Badge>
                    </div>
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
                        <SelectTrigger className="flex-1 sm:w-[160px] sm:flex-none h-10">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEWEST">Newest First</SelectItem>
                            <SelectItem value="OLDEST">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grid */}
            {filteredAndSortedWorkouts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No workouts match your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredAndSortedWorkouts.map((workout) => (
                        <WorkoutCard key={workout.id} workout={workout} />
                    ))}
                </div>
            )}
        </div>
    )
}
