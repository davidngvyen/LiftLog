'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, ImagePlus, X, ChevronDown, Check } from "lucide-react"
import { updateWorkout, getWorkouts } from '@/services/workout.service'
import { WorkoutWithExercises } from '@/types/workout'
import { toast } from 'sonner'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CreatePostProps {
    userId: string
    onPostCreated?: () => void
}

export function CreatePost({ userId, onPostCreated }: CreatePostProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null)
    const [caption, setCaption] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([])
    const [loadingWorkouts, setLoadingWorkouts] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // For Select
    const [openSelect, setOpenSelect] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && workouts.length === 0) {
            setLoadingWorkouts(true)
            // Fetch workouts
            // We need a server action or API to fetch workouts client side
            // Ideally we pass this in props or use SWR/React Query. 
            // For now, assume we can call the server action directly (as it's 'use server')
            getWorkouts(userId)
                .then(data => setWorkouts(data as unknown as WorkoutWithExercises[]))
                .catch(err => console.error(err))
                .finally(() => setLoadingWorkouts(false))
        }
    }, [isOpen, userId, workouts.length])

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

            if (!res.ok) throw new Error("Upload failed")
            const data = await res.json()
            if (data.url) {
                setImageUrl(data.url)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to upload photo")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async () => {
        if (!selectedWorkoutId) {
            toast.error("Please select a workout to attach context.")
            return
        }

        setIsSubmitting(true)
        try {
            // We are using updateWorkout to attach the image and caption to an existing workout
            // Ideally we'd have a separate 'Post' model, but re-using Workout as requested.
            await updateWorkout(userId, {
                id: selectedWorkoutId,
                caption,
                imageUrl
            })

            toast.success("Posted to feed!")
            setIsOpen(false)
            setCaption("")
            setImageUrl("")
            setSelectedWorkoutId(null)
            if (onPostCreated) onPostCreated()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create post")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return (
            <div className="mb-6 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 p-4 text-center">
                <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={() => setIsOpen(true)}>
                    <ImagePlus className="h-5 w-5" />
                    Share a workout photo...
                </Button>
            </div>
        )
    }

    return (
        <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold">Create Post</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                {/* Workout Selector */}
                <div className="space-y-2">
                    <Label>Select Workout (Context)</Label>
                    <Popover open={openSelect} onOpenChange={setOpenSelect}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openSelect}
                                className="w-full justify-between"
                            >
                                {selectedWorkoutId
                                    ? workouts.find((w) => w.id === selectedWorkoutId)?.name || "Select workout..."
                                    : "Select recent workout..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder="Search workout..." />
                                <CommandList>
                                    <CommandEmpty>No workouts found.</CommandEmpty>
                                    <CommandGroup>
                                        {workouts.slice(0, 10).map((workout) => (
                                            <CommandItem
                                                key={workout.id}
                                                value={workout.name + workout.id}
                                                onSelect={() => {
                                                    setSelectedWorkoutId(workout.id)
                                                    setOpenSelect(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedWorkoutId === workout.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex flex-col">
                                                    <span>{workout.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(workout.date).toLocaleDateString()} • {workout.exercises.length} Exercises
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                    <Label>Photo</Label>
                    {imageUrl ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-black/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2 h-8 w-8"
                                onClick={() => setImageUrl("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/5 px-6 py-8 transition-colors hover:bg-muted/10"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                            )}
                            <p className="text-xs text-muted-foreground">Click to upload</p>
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
                </div>

                {/* Caption */}
                <div className="space-y-2">
                    <Label>Caption</Label>
                    <Textarea
                        placeholder="Say something about this workout..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="resize-none"
                    />
                </div>

                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting || !selectedWorkoutId}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post to Feed
                </Button>
            </div>
        </div>
    )
}
