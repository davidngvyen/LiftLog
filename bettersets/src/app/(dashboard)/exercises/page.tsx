import React from "react";
import { Sword } from "lucide-react";
import ExerciseList from "@/components/workout/ExerciseList";
import { prisma } from "@/lib/db";

import { Exercise } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function ExercisesPage() {
  let exercises: Exercise[] = [];
  let error = null;

  try {
    exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (e) {
    console.error("Failed to load exercises:", e);
    error = e;
  }

  if (error) {
    return (
      <div className="p-8 text-center border-4 border-black bg-red-100 text-red-600 font-bold uppercase">
        Failed to load exercises. Check server logs.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="border-4 border-black bg-gradient-to-r from-blue-500 to-cyan-500 p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-2 border-black bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-gradient-to-br from-blue-400 to-cyan-400">
              <Sword className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl uppercase leading-relaxed font-bold">⚔️ SKILL LIBRARY</h1>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-semibold">BROWSE ALL BATTLE MOVES</p>
            </div>
          </div>
        </div>
      </div>

      <ExerciseList initialExercises={exercises} />
    </div>
  );
}
