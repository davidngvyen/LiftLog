
import { prisma as db } from "@/lib/db";
import { Exercise } from "@prisma/client";

export const getExerciseById = async (id: string): Promise<Exercise | null> => {
    try {
        const exercise = await db.exercise.findUnique({
            where: { id },
        });
        return exercise;
    } catch (error) {
        console.error("Error fetching exercise:", error);
        return null;
    }
};

export const getExercises = async (query?: string): Promise<Exercise[]> => {
    try {
        const exercises = await db.exercise.findMany({
            where: query ? {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { muscleGroup: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } }
                ]
            } : undefined,
            orderBy: {
                name: 'asc'
            }
        })
        return exercises
    } catch (error) {
        console.error("Error fetching exercises:", error)
        return []
    }
}

export const getLastExercisesPerformance = async (userId: string, exerciseIds: string[]) => {
    try {
        const results = await Promise.all(exerciseIds.map(async (exerciseId) => {
            const lastWorkoutExercise = await db.workoutExercise.findFirst({
                where: {
                    exerciseId,
                    workout: {
                        userId,
                        isCompleted: true
                    }
                },
                orderBy: {
                    workout: {
                        date: 'desc'
                    }
                },
                include: {
                    sets: {
                        orderBy: {
                            setNumber: 'asc'
                        }
                    }
                }
            })

            return {
                exerciseId,
                sets: lastWorkoutExercise?.sets || []
            }
        }))

        // Convert to map for easy lookup
        return results.reduce((acc, curr) => {
            acc[curr.exerciseId] = curr.sets
            return acc
        }, {} as Record<string, typeof results[0]['sets']>)

    } catch (error) {
        console.error("Error fetching last performance:", error)
        return {}
    }
}
