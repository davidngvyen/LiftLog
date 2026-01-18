"use client";

import React, { useState } from "react";
import { Search, Sword } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import type { Exercise } from "@prisma/client";

const categoryColors: Record<string, string> = {
  Chest: "bg-red-400",
  Legs: "bg-blue-400",
  Back: "bg-green-400",
  Shoulders: "bg-yellow-400",
  Arms: "bg-purple-400",
  Core: "bg-orange-400",
  Cardio: "bg-pink-400",
  Flexibility: "bg-teal-400",
};

interface ExerciseListProps {
  initialExercises: Exercise[];
}

export default function ExerciseList({ initialExercises }: ExerciseListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = initialExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="SEARCH SKILLS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-4 border-black pl-12 text-sm uppercase leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-12"
        />
      </div>

      {/* Stats Summary */}
      <div className="border-4 border-black bg-gradient-to-r from-yellow-200 to-orange-200 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between text-xs uppercase font-bold">
          <span>📚 TOTAL SKILLS: {initialExercises.length}</span>
          <span>🔍 SHOWING: {filteredExercises.length}</span>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {filteredExercises.map((exercise) => (
          <Link
            key={exercise.id}
            href={`/exercises/${exercise.id}`}
            className="block border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center border-4 border-black ${categoryColors[exercise.muscleGroup] || categoryColors[exercise.category] || 'bg-gray-400'}`}>
                <Sword className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm uppercase leading-relaxed font-bold">{exercise.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                  <span className={`border-2 border-black px-2 py-1 uppercase leading-relaxed text-black font-bold ${categoryColors[exercise.muscleGroup] || 'bg-gray-400'}`}>
                    {exercise.muscleGroup}
                  </span>
                  <span className="border-2 border-black bg-white px-2 py-1 uppercase leading-relaxed text-black font-bold">
                    {exercise.category}
                  </span>
                  {exercise.equipment && (
                    <span className="border-2 border-black bg-cyan-400 px-2 py-1 uppercase leading-relaxed text-black font-bold">
                      {exercise.equipment.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredExercises.length === 0 && (
          <div className="p-8 text-center border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold uppercase">No exercises found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
