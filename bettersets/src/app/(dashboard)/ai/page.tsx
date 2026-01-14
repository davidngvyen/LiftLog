"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";

export default function AIWorkoutPage() {
    const [goal, setGoal] = useState("strength");
    const [experience, setExperience] = useState("intermediate");
    const [equipment, setEquipment] = useState("full gym");
    const [duration, setDuration] = useState("60");
    const [generatedWorkout, setGeneratedWorkout] = useState<{
        name: string;
        exercises: { exerciseName: string; sets: number; reps: number; restTime: number; notes: string }[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const generateWorkout = async () => {
        setLoading(true);
        // Simulate AI generation
        setTimeout(() => {
            setGeneratedWorkout({
                name: "AI Generated Power Quest",
                exercises: [
                    { exerciseName: "Squat", sets: 3, reps: 5, restTime: 180, notes: "Focus on depth" },
                    { exerciseName: "Bench Press", sets: 3, reps: 5, restTime: 180, notes: "Explosive concentric" },
                    { exerciseName: "Deadlift", sets: 1, reps: 5, restTime: 180, notes: "Maintain neutral spine" }
                ]
            });
            setLoading(false);
            // toast.success("Quest generated!");
        }, 2000);
    };

    const saveWorkout = async () => {
        // toast.success("Quest saved to log!");
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Header */}
            <div className="border-4 border-black bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="border-2 border-black bg-white p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-gradient-to-br from-pink-400 to-red-400 animate-pulse">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl uppercase leading-relaxed">✨ QUEST GENERATOR</h1>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">AI-POWERED CUSTOM QUESTS</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <Card className="border-4 border-black bg-gradient-to-r from-cyan-200 to-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 shrink-0 text-black" />
                        <div className="text-xs leading-relaxed text-black font-bold">
                            <p className="font-extrabold uppercase mb-1">🤖 AI QUEST MASTER</p>
                            <p className="uppercase">
                                THE AI QUEST MASTER ANALYZES YOUR WARRIOR CLASS, EXPERIENCE LEVEL, AND AVAILABLE GEAR TO CREATE
                                PERSONALIZED TRAINING QUESTS FOR MAXIMUM GAINS!
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Generator Form */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                    <CardTitle className="uppercase">🎮 QUEST PARAMETERS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="goal" className="uppercase text-xs font-bold">🎯 TRAINING GOAL</Label>
                            <Select value={goal} onValueChange={setGoal}>
                                <SelectTrigger id="goal" className="border-2 border-black">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-black">
                                    <SelectItem value="strength">💪 STRENGTH BUILD</SelectItem>
                                    <SelectItem value="hypertrophy">🦾 MUSCLE GROWTH</SelectItem>
                                    <SelectItem value="endurance">🏃 ENDURANCE BOOST</SelectItem>
                                    <SelectItem value="weight-loss">🔥 FAT BURN</SelectItem>
                                    <SelectItem value="general-fitness">⚡ GENERAL FITNESS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience" className="uppercase text-xs font-bold">📊 WARRIOR CLASS</Label>
                            <Select value={experience} onValueChange={setExperience}>
                                <SelectTrigger id="experience" className="border-2 border-black">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-black">
                                    <SelectItem value="beginner">🌱 NOVICE</SelectItem>
                                    <SelectItem value="intermediate">⚔️ WARRIOR</SelectItem>
                                    <SelectItem value="advanced">👑 LEGEND</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="equipment" className="uppercase text-xs font-bold">🛡️ AVAILABLE GEAR</Label>
                            <Select value={equipment} onValueChange={setEquipment}>
                                <SelectTrigger id="equipment" className="border-2 border-black">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-black">
                                    <SelectItem value="full gym">🏋️ FULL ARMORY</SelectItem>
                                    <SelectItem value="dumbbells only">🔨 DUMBBELLS ONLY</SelectItem>
                                    <SelectItem value="barbell only">⚒️ BARBELL ONLY</SelectItem>
                                    <SelectItem value="bodyweight">🥋 BODYWEIGHT ONLY</SelectItem>
                                    <SelectItem value="home gym">🏠 HOME ARMORY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration" className="uppercase text-xs font-bold">⏱️ QUEST DURATION</Label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger id="duration" className="border-2 border-black">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-black">
                                    <SelectItem value="30">⏰ 30 MINUTES</SelectItem>
                                    <SelectItem value="45">⏰ 45 MINUTES</SelectItem>
                                    <SelectItem value="60">⏰ 60 MINUTES</SelectItem>
                                    <SelectItem value="90">⏰ 90 MINUTES</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={generateWorkout}
                        disabled={loading}
                        className="w-full h-12 border-4 border-black bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] uppercase text-sm font-bold"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                GENERATING QUEST...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                GENERATE QUEST
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Generated Workout */}
            {generatedWorkout && (
                <Card className="border-4 border-black bg-gradient-to-br from-green-100 to-emerald-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="uppercase text-sm">🏆 QUEST: {generatedWorkout.name}</span>
                            <Button onClick={saveWorkout} variant="outline" className="border-2 border-black text-xs uppercase bg-white hover:bg-gray-100">
                                💾 SAVE QUEST
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {generatedWorkout.exercises.map((exercise, index) => (
                            <div
                                key={index}
                                className="border-4 border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-black bg-gradient-to-br from-primary to-orange-500">
                                        <span className="text-lg font-bold text-white">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm uppercase leading-relaxed font-bold">⚔️ {exercise.exerciseName}</h4>
                                        <p className="text-xs leading-relaxed text-muted-foreground uppercase font-bold">
                                            {exercise.sets} SETS × {exercise.reps} REPS
                                            {exercise.restTime && ` • ${exercise.restTime}S REST`}
                                        </p>
                                        {exercise.notes && (
                                            <p className="mt-2 rounded border-2 border-black bg-yellow-200 p-2 text-xs uppercase leading-relaxed font-bold">
                                                💡 TIP: {exercise.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 border-4 border-black bg-gradient-to-r from-yellow-300 to-yellow-400 p-4">
                            <p className="text-center text-sm uppercase font-bold">🎁 QUEST REWARDS: +1 XP • +{generatedWorkout.exercises.length * 10} GOLD</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
