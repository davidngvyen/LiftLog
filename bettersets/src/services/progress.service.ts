import { prisma } from '@/lib/db'

export type ExerciseProgressPoint = {
    date: Date
    maxWeight: number
    totalVolume: number
    estimated1RM: number
}

export async function getExerciseProgress(
    userId: string,
    exerciseId: string
): Promise<ExerciseProgressPoint[]> {
    try {
        const workouts = await prisma.workout.findMany({
            where: {
                userId,
                exercises: {
                    some: {
                        exerciseId
                    }
                }
            },
            include: {
                exercises: {
                    where: {
                        exerciseId
                    },
                    include: {
                        sets: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        })

        const progressData: ExerciseProgressPoint[] = workouts.map(workout => {
            // Since we filtered workouts that HAVE the exercise, and included only that exercise,
            // we should have at least one workoutExercise. 
            // However, a safe check is always good.
            const workoutExercise = workout.exercises[0]

            if (!workoutExercise || !workoutExercise.sets.length) {
                return null
            }

            const validSets = workoutExercise.sets.filter(set => !set.isWarmup && set.weight > 0 && set.reps > 0)

            if (validSets.length === 0) {
                return null
            }

            let maxWeight = 0
            let totalVolume = 0
            let max1RM = 0

            for (const set of validSets) {
                // Max Weight
                if (set.weight > maxWeight) {
                    maxWeight = set.weight
                }

                // Volume
                totalVolume += set.weight * set.reps

                // Epley Formula: Weight * (1 + Reps / 30)
                const epley1RM = set.weight * (1 + set.reps / 30)
                if (epley1RM > max1RM) {
                    max1RM = epley1RM
                }
            }

            return {
                date: workout.date,
                maxWeight,
                totalVolume,
                estimated1RM: max1RM
            }
        }).filter((item): item is ExerciseProgressPoint => item !== null)

        return progressData

    } catch (error) {
        console.error("Error fetching exercise progress", error)
        return []
    }
}
