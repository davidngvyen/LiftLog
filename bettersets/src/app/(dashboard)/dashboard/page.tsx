"use client";

import React, { useEffect, useState } from "react";
import { Dumbbell, TrendingUp, Flame, Zap, Target, Award, Star, Heart, Trophy, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
// import { toast } from "sonner"; // Use if configured
import { CharacterAvatar, CharacterCustomization } from "@/components/CharacterAvatar";
import WorkoutCard from "@/components/workout/WorkoutCard"; // IMPORTED FOR YOU
import { WorkoutWithExercises } from "@/types/workout"; // IMPORTED FOR YOU
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

interface Stats {
  workoutCount: number;
  totalVolume: number;
  currentStreak: number;
  weeklyWorkouts: number;
  // TODO: Update this type to match your API response structure if needed
  recentWorkouts: WorkoutWithExercises[];
}

export default function DashboardPage() {
  const { user } = useApp();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate user level from workout count
  const workoutCount = stats?.workoutCount || user?.workoutCount || 0;
  const userLevel = Math.floor(workoutCount / 5) + 1;
  const xpProgress = (workoutCount % 5) * 20; // 0-100%
  const xpToNextLevel = 5 - (workoutCount % 5);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        let workouts: WorkoutWithExercises[] = [];
        try {
          // STEP 1: Fetch data from the API
          const response = await fetch('/api/workouts');
          if (!response.ok) {
            // If 401 or other error, throw to trigger catch and use mock data
            throw new Error("Failed to fetch");
          }
          workouts = await response.json();
        } catch (error) {
          console.warn("Failed to fetch real data, using mock data for guest", error);
          // Fallback MOCK DATA for Guest/Demo
          workouts = [
            {
              id: '1', date: new Date().toISOString(), name: 'Morning Pump', userId: 'guest',
              createdAt: new Date(), updatedAt: new Date(),
              exercises: [
                {
                  id: 'e1', exerciseId: 'ex1', workoutId: '1', order: 1,
                  exercise: { id: 'ex1', name: 'Bench Press', category: 'Chest', equipment: 'Barbell', userId: 'guest', description: null, videoUrl: null, muscleGroup: 'Chest', secondaryMuscles: [], createdAt: new Date(), updatedAt: new Date() },
                  sets: [
                    { id: 's1', workoutExerciseId: 'e1', setNumber: 1, weight: 135, reps: 10, isWarmup: true, rpe: 7, createdAt: new Date() },
                    { id: 's2', workoutExerciseId: 'e1', setNumber: 2, weight: 185, reps: 5, isWarmup: false, rpe: 9, createdAt: new Date() }
                  ]
                }
              ]
            },
            {
              id: '2', date: new Date(Date.now() - 86400000).toISOString(), name: 'Leg Day', userId: 'guest',
              createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 86400000),
              exercises: []
            }
          ] as unknown as WorkoutWithExercises[]; // Cast to satisfy type if needed, though structure matches
        }

        // STEP 2: Calculate Statistics
        const workoutCount = workouts.length;

        const totalVolume = workouts.reduce((total, workout) => {
          return total + workout.exercises.reduce((workoutTotal, exercise) => {
            return workoutTotal + exercise.sets.reduce((setTotal, set) => {
              return setTotal + (set.weight * set.reps);
            }, 0);
          }, 0);
        }, 0);

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weeklyWorkouts = workouts.filter(w => new Date(w.date) > oneWeekAgo).length;

        // Simple streak calculation
        const uniqueDates = new Set(workouts.map(w => new Date(w.date).toISOString().split('T')[0]));
        let streak = 0;
        const checkDate = new Date();

        // Check if we worked out today
        if (uniqueDates.has(checkDate.toISOString().split('T')[0])) {
          streak++;
        }

        // Check yesterday and backwards
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          if (uniqueDates.has(checkDate.toISOString().split('T')[0])) {
            streak++;
          } else {
            break;
          }
        }

        // STEP 3: Update State
        setStats({
          workoutCount,
          totalVolume,
          currentStreak: streak,
          weeklyWorkouts,
          recentWorkouts: workouts.slice(0, 5)
        })

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Player Card with Level & XP */}
      <div className="border-4 border-black bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-2 border-black bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.character ? (
                <CharacterAvatar customization={user.character as CharacterCustomization} size="md" />
              ) : (
                <div className="h-16 w-16 bg-gray-200 border-2 border-black flex items-center justify-center">
                  <span className="text-xs">NO AVATAR</span>
                </div>
              )}
              <div>
                <h2 className="text-lg uppercase leading-relaxed">{user?.name?.toUpperCase() || "WARRIOR"}</h2>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <p className="text-xs uppercase leading-relaxed">LEVEL {userLevel} WARRIOR</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(Math.min(stats?.currentStreak || 0, 5))].map((_, i) => (
                <Heart key={i} className="h-5 w-5 fill-red-500 text-red-500" />
              ))}
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="uppercase">XP TO NEXT LEVEL</span>
              <span className="uppercase">{xpToNextLevel} QUESTS</span>
            </div>
            <div className="h-6 border-4 border-black bg-gray-300 relative">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-500 absolute top-0 left-0"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h2 className="text-base uppercase leading-relaxed">DAILY QUESTS</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="group border-4 border-black bg-gradient-to-br from-primary via-orange-500 to-red-500 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-yellow-400">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-normal uppercase leading-relaxed text-white">START QUEST</h3>
                <p className="text-xs leading-relaxed text-white/80">+1 XP REWARD</p>
              </div>
            </div>
          </button>

          <button className="group border-4 border-black bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-yellow-400">
                <Target className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-normal uppercase leading-relaxed text-white">AI QUEST GEN</h3>
                <p className="text-xs leading-relaxed text-white/80">CUSTOM QUESTS</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Player Stats */}
      <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-base uppercase leading-relaxed">⚔️ PLAYER STATS</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="🎯 QUESTS"
            value={stats?.workoutCount || 0}
            icon={Dumbbell}
            color="bg-orange-500"
          />
          <StatCard
            title="💪 POWER"
            value={`${formatVolume(stats?.totalVolume || 0)}`}
            unit="LBS"
            icon={TrendingUp}
            color="bg-yellow-400"
          />
          <StatCard
            title="🔥 STREAK"
            value={`${stats?.currentStreak || 0}`}
            unit="DAYS"
            icon={Flame}
            color="bg-red-500"
          />
          <StatCard
            title="⭐ WEEKLY"
            value={`${stats?.weeklyWorkouts || 0}`}
            unit="WINS"
            icon={Award}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Quest Log */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-base uppercase leading-relaxed">📜 QUEST LOG</h2>
        {stats?.recentWorkouts?.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-4 border-black bg-gray-300">
              <Dumbbell className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-sm uppercase leading-relaxed">NO QUESTS COMPLETED</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              START YOUR FIRST QUEST ABOVE!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats?.recentWorkouts?.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center border-2 border-black ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-xs uppercase leading-relaxed text-muted-foreground">{title}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-normal leading-relaxed">{value}</span>
        {unit && <span className="text-sm font-normal leading-relaxed text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
