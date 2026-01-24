'use server'

import { prisma } from '@/lib/db'
import { CreateWorkoutInput, workoutWithExercises } from '@/types/workout'
import { revalidatePath } from 'next/cache'
import { CacheService } from './cache.service'

export async function getWorkouts(userId: string) {
    return CacheService.getWorkouts(userId, async () => {
        try {
            const workouts = await prisma.workout.findMany({
                where: {
                    userId,
                },
                include: {
                    exercises: {
                        include: {
                            exercise: true,
                            sets: true
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy: {
                    date: 'desc',
                },
            })
            return workouts
        } catch (error) {
            console.error('Error fetching workouts:', error)
            return []
        }
    })
}

export async function getWorkoutById(id: string) {
    try {
        const workout = await prisma.workout.findUnique({
            where: { id },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                        sets: {
                            orderBy: {
                                setNumber: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        })
        return workout
    } catch (error) {
        console.error('Error fetching workout:', error)
        return null
    }
}

export async function createWorkout(userId: string, data: CreateWorkoutInput) {
    try {
        const workout = await prisma.workout.create({
            data: {
                userId,
                name: data.name,
                date: data.date || new Date(),
                notes: data.notes,
                startTime: data.startTime,
                endTime: data.endTime,
                exercises: {
                    create: data.exercises.map((exercise) => ({
                        exerciseId: exercise.exerciseId,
                        order: exercise.order,
                        sets: {
                            create: exercise.sets.map((set) => ({
                                setNumber: set.setNumber,
                                reps: set.reps,
                                weight: set.weight,
                                isWarmup: set.isWarmup,
                                rpe: set.rpe,
                            })),
                        },
                    })),
                },
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                        sets: true
                    }
                }
            }
        })


        revalidatePath('/workouts')
        await CacheService.invalidateWorkouts(userId)
        return workout
    } catch (error) {
        console.error('Error creating workout:', error)
        throw error // Re-throw to handle in UI
    }
}

export async function updateWorkout(userId: string, data: { id: string } & Partial<CreateWorkoutInput>) {
    try {
        // Transaction to ensure atomicity
        const workout = await prisma.$transaction(async (tx) => {
            // 1. Update basic info
            const updated = await tx.workout.update({
                where: { id: data.id, userId },
                data: {
                    name: data.name,
                    date: data.date,
                    notes: data.notes,
                    startTime: data.startTime,
                    endTime: data.endTime,
                }
            })

            // 2. If exercises are provided, replace them entirely
            // This is a simple strategy: delete all existing exercises and re-create
            if (data.exercises) {
                await tx.workoutExercise.deleteMany({
                    where: { workoutId: data.id }
                })

                for (const exercise of data.exercises) {
                    await tx.workoutExercise.create({
                        data: {
                            workoutId: data.id,
                            exerciseId: exercise.exerciseId,
                            order: exercise.order,
                            sets: {
                                create: exercise.sets.map(set => ({
                                    setNumber: set.setNumber,
                                    reps: set.reps,
                                    weight: set.weight,
                                    isWarmup: set.isWarmup,
                                    rpe: set.rpe,
                                }))
                            }
                        }
                    })
                }
            }

            // 3. Fetch the complete workout with new exercises
            return await tx.workout.findUnique({
                where: { id: data.id },
                include: {
                    exercises: {
                        include: {
                            exercise: true,
                            sets: {
                                orderBy: {
                                    setNumber: 'asc',
                                },
                            },
                        },
                        orderBy: {
                            order: 'asc',
                        },
                    },
                },
            })
        })

        revalidatePath('/workouts')
        revalidatePath(`/workouts/${data.id}`)
        await CacheService.invalidateWorkouts(userId)
        return workout
    } catch (error) {
        console.error('Error updating workout:', error)
        throw error
    }
}

export async function deleteWorkout(userId: string, workoutId: string) {
    try {
        await prisma.workout.delete({
            where: {
                id: workoutId,
                userId, // Ensure ownership
            }
        })

        revalidatePath('/workouts')
        await CacheService.invalidateWorkouts(userId)
        return { success: true }
    } catch (error) {
        console.error('Error deleting workout:', error)
        throw error
    }
}
