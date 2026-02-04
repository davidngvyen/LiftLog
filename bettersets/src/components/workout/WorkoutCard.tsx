'use client'

import React, { useState } from "react"
import Link from "next/link"
import { Trophy, Trash2 } from "lucide-react"
import { WorkoutWithExercises } from "@/types/workout"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WorkoutCardProps {
  workout: WorkoutWithExercises
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent Link click
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/workouts/${workout.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Workout deleted')
      router.refresh()
      setShowDeleteDialog(false)
    } catch (error) {
      toast.error('Failed to delete workout')
    } finally {
      setIsDeleting(false)
    }
  }

  const openDeleteDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteDialog(true)
  }
  // -------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // -------------------------------------------------------------------------

  // 1. Calculate Duration
  const duration = React.useMemo(() => {
    if (!workout.startTime || !workout.endTime) return "N/A";

    const start = new Date(workout.startTime).getTime();
    const end = new Date(workout.endTime).getTime();
    const diff = end - start;
    const minutes = Math.floor(diff / 60000);

    return `${minutes}min`;
  }, [workout.startTime, workout.endTime]);

  // 2. Calculate Total Volume
  const totalVolume = React.useMemo(() => {
    let volume = 0;

    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        volume += (set.weight * set.reps);
      });
    });

    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`; // Keep K format simpler
    }

    // Check if it's an integer
    if (Number.isInteger(volume)) {
      return `${volume}`;
    }

    return `${volume.toFixed(2)}`;
  }, [workout.exercises]);

  // -------------------------------------------------------------------------
  // RENDER LOGIC
  // -------------------------------------------------------------------------

  return (
    <>
      <div className="relative group">
        <Link
          href={`/workouts/${workout.id}`}
          className="group block flex items-center gap-4 border-4 border-black bg-gradient-to-r from-emerald-100 to-green-100 p-4 min-h-[44px] transition-all hover:translate-x-1 hover:translate-y-1"
        >
          {/* ICON SECTION */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border-4 border-black bg-gradient-to-br from-yellow-300 to-yellow-500">
            <Trophy className="h-7 w-7 text-black" />
          </div>

          {/* CONTENT SECTION */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* 1. Render Name */}
              <h3 className="text-sm font-bold uppercase leading-relaxed truncate">
                QUEST: {workout.name}
              </h3>

              {/* 2. Render Completion Badge */}
              {workout.endTime && (
                <span className="border-2 border-black bg-green-400 px-2 py-0.5 text-xs uppercase">
                  ✓ COMPLETE
                </span>
              )}
            </div>

            {/* 3. Render Details Line */}
            <p className="text-xs leading-relaxed text-muted-foreground">
              {workout.exercises.length} BATTLES • {duration} • +1 XP
            </p>
          </div>

          {/* STATS SECTION (Right side) */}
          <div className="text-right hidden sm:block mr-8">
            {/* 1. Render Volume */}
            <p className="text-sm font-normal leading-relaxed text-green-600">
              💰 {totalVolume} LBS
            </p>

            {/* 2. Render Date */}
            <p className="text-xs leading-relaxed text-muted-foreground">
              {new Date(workout.date || new Date()).toLocaleDateString()}
            </p>
          </div>
        </Link>

        {/* Delete Button - Positioned absolute to avoid nesting issues if possible, or just inside relative container */}
        <button
          onClick={openDeleteDialog}
          className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-destructive transition-colors z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Delete Workout"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
