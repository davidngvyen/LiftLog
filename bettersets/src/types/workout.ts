import { Prisma } from '@prisma/client'

// Define the shape of a workout with its relations included
export const workoutWithExercises = Prisma.validator<Prisma.WorkoutDefaultArgs>()({
    include: {
        exercises: {
            include: {
                exercise: true,
                sets: true,
            },
            orderBy: {
                order: 'asc',
            },
        },
    },
})

export type WorkoutWithExercises = Prisma.WorkoutGetPayload<typeof workoutWithExercises>

export type CreateSetInput = {
    setNumber: number
    reps: number
    weight: number
    isWarmup?: boolean
    rpe?: number
}

export type CreateWorkoutExerciseInput = {
    exerciseId: string
    order: number
    sets: CreateSetInput[]
}

export type CreateWorkoutInput = {
    name: string
    date?: Date
    startTime?: Date
    endTime?: Date
    notes?: string
    exercises: CreateWorkoutExerciseInput[]
}

export type UpdateWorkoutInput = Partial<CreateWorkoutInput> & {
    id: string
}
