
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
