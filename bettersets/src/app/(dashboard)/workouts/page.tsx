"use client";

import React, { useState, useEffect } from "react";
import { Play, Check, Plus, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { toast } from "sonner";

interface Set {
  reps: number;
  weight: number;
  rpe?: number;
  isWarmup: boolean;
  completed: boolean;
}

interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: Set[];
}

// Use a subset of mock exercises for the dropdown
const mockExercises = [
  { id: "1", name: "Bench Press", category: "Chest", equipment: "Barbell" },
  { id: "2", name: "Squat", category: "Legs", equipment: "Barbell" },
  { id: "3", name: "Deadlift", category: "Back", equipment: "Barbell" },
];

export default function WorkoutPage() {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{ id: string; name: string; category: string; equipment: string } | null>(null);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      const interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            // toast.success("Rest complete!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isResting, restTimer]);

  const startWorkout = () => {
    setStartTime(new Date());
    setWorkoutName("Daily Quest");
    setExercises([]);
  };

  const addExercise = (exercise: { id: string; name: string }) => {
    setExercises([
      ...exercises,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: [{ reps: 0, weight: 0, isWarmup: false, completed: false }],
      },
    ]);
    setSelectedExercise(null);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({
      reps: 0,
      weight: 0,
      isWarmup: false,
      completed: false,
    });
    setExercises(newExercises);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof Set,
    value: string | number | boolean
  ) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setExercises(newExercises);
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex].completed = true;
    setExercises(newExercises);
    startRestTimer(90); // Default 90 seconds rest
  };

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setIsResting(true);
  };

  const finishWorkout = async () => {
    if (exercises.length === 0) {
      // toast.error("Add at least one exercise");
      return;
    }

    // Call API to save workout
    // toast.success("Workout completed!");
    setStartTime(null);
    setExercises([]);
    setWorkoutName("");
    setElapsedTime(0);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  if (!startTime) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 pb-20 lg:pb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Play className="h-12 w-12 text-white ml-2" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold uppercase">Ready to Train?</h2>
          <p className="text-muted-foreground uppercase text-xs">Start a new workout session</p>
        </div>
        <Button
          onClick={startWorkout}
          className="h-14 bg-gradient-to-r from-primary to-orange-500 px-8 text-white hover:from-orange-600 hover:to-red-500 border-4 border-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none active:translate-x-2 active:translate-y-2"
        >
          Start Workout
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Workout Header */}
      <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Input
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="text-xl font-bold border-none px-0 h-auto focus-visible:ring-0 uppercase placeholder:uppercase"
                placeholder="WORKOUT NAME"
              />
              <p className="text-xs text-muted-foreground uppercase font-bold">
                {exercises.length} exercises
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold font-mono">{formatTime(elapsedTime)}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold">Duration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rest Timer */}
      {isResting && (
        <Card className="border-4 border-black bg-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 text-orange-600" />
              <div>
                <p className="font-bold text-orange-900 uppercase text-sm">Rest Timer</p>
                <p className="text-xs text-orange-700 uppercase">Take a break</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-900 font-mono">{restTimer}s</p>
          </CardContent>
        </Card>
      )}

      {/* Exercises */}
      <div className="space-y-4">
        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exerciseIndex} className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="pb-3">
              <CardTitle className="uppercase">{exercise.exerciseName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-6 gap-2 text-xs font-bold text-muted-foreground uppercase text-center">
                <div className="col-span-1">Set</div>
                <div className="col-span-1 text-left">LBS</div>
                <div className="col-span-1 text-left">Reps</div>
                <div className="col-span-1">RPE</div>
                <div className="col-span-1">Warm</div>
                <div className="col-span-1"></div>
              </div>

              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="grid grid-cols-6 gap-2 items-center">
                  <div className="flex items-center justify-center font-bold bg-gray-100 h-10 w-8 mx-auto rounded border-2 border-black text-sm">
                    {setIndex + 1}
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={set.weight || ""}
                      onChange={(e) =>
                        updateSet(exerciseIndex, setIndex, "weight", Number(e.target.value))
                      }
                      placeholder="0"
                      className="h-10 text-center border-2 border-black"
                      disabled={set.completed}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateSet(exerciseIndex, setIndex, "reps", Number(e.target.value))
                      }
                      placeholder="0"
                      className="h-10 text-center border-2 border-black"
                      disabled={set.completed}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={set.rpe || ""}
                      onChange={(e) =>
                        updateSet(exerciseIndex, setIndex, "rpe", Number(e.target.value))
                      }
                      placeholder="-"
                      max={10}
                      className="h-10 text-center border-2 border-black"
                      disabled={set.completed}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <input
                      type="checkbox"
                      checked={set.isWarmup}
                      onChange={(e) =>
                        updateSet(exerciseIndex, setIndex, "isWarmup", e.target.checked)
                      }
                      className="h-5 w-5 border-2 border-black accent-primary"
                      disabled={set.completed}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      size="sm"
                      variant={set.completed ? "secondary" : "default"}
                      onClick={() => completeSet(exerciseIndex, setIndex)}
                      disabled={set.completed}
                      className={`w-full h-10 border-2 border-black ${set.completed ? 'bg-green-100 text-green-700' : 'bg-primary text-white'}`}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addSet(exerciseIndex)}
                className="w-full border-2 border-dashed border-black hover:border-solid hover:bg-gray-50 uppercase text-xs"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Set
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Exercise Button */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-4 border-black h-12 dashed border-dashed uppercase hover:border-solid bg-white" onClick={() => setSelectedExercise({ id: "", name: "", category: "", equipment: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto border-4 border-black">
          <DialogHeader>
            <DialogTitle className="uppercase">Select Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {mockExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => addExercise(exercise)}
                className="w-full rounded-none border-2 border-black p-4 text-left transition-all hover:bg-primary/10 hover:translate-x-1"
              >
                <h4 className="font-bold uppercase text-sm">{exercise.name}</h4>
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  {exercise.category} • {exercise.equipment}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Finish Button */}
      {exercises.length > 0 && (
        <Button
          onClick={finishWorkout}
          className="h-14 w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 border-4 border-black uppercase text-sm font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none active:translate-x-2 active:translate-y-2 sticky bottom-20 lg:bottom-6"
        >
          <Check className="mr-2 h-5 w-5" /> Finish Quest
        </Button>
      )}
    </div>
  );
}
