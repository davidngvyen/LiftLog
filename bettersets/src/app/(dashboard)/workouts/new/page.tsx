import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getExercises, getLastExercisesPerformance } from "@/services/exercise.service"
import { getActivePlan, getPlanById, getUserPlans } from "@/services/workout-plan.service"
import NewWorkoutClient from "./NewWorkoutClient"

export const metadata = {
  title: "New Workout | BetterSets",
  description: "Create a new workout plan.",
}

export default async function NewWorkoutPage({ searchParams }: { searchParams: Promise<{ planId?: string }> }) {
  const session = await auth()
  const { planId: requestedPlanId } = await searchParams

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const [exercises, activePlanData, userPlans] = await Promise.all([
    getExercises(),
    getActivePlan(session.user.id),
    getUserPlans(session.user.id)
  ])

  let templateData = undefined
  let advanceActivePlan = false

  // Logic: 
  // 1. If planId param exists, use that plan (finding 1st day or next incomplete day logic if possible, simplified to day 1 or active day if matches active plan).
  // 2. Else if activePlanData exists, use it.

  let targetPlanData = activePlanData

  if (requestedPlanId) {
    // If user specifically requested a plan
    if (activePlanData?.plan.id === requestedPlanId) {
      // It's the active one, use existing active logic
      targetPlanData = activePlanData
    } else {
      // Fetch specific plan
      const plan = await getPlanById(requestedPlanId)
      if (plan) {
        targetPlanData = {
          plan,
          activeDayIndex: 0, // Default to first day if just selecting a random plan
          activeDay: plan.days[0]
        }
        advanceActivePlan = false // Don't advance active plan if working on a different one
      }
    }
  }

  if (targetPlanData) {
    if (targetPlanData.plan.id === activePlanData?.plan.id && !requestedPlanId) {
      advanceActivePlan = true
    }

    const { activeDay } = targetPlanData

    const exerciseIds = activeDay.exercises.map((ex: any) => ex.exerciseId)
    const historyMap = await getLastExercisesPerformance(session.user.id, exerciseIds)

    // Map plan day to workout template
    templateData = {
      name: activeDay.name,
      notes: `Day ${targetPlanData.activeDayIndex + 1} of ${targetPlanData.plan.name}`,
      exercises: activeDay.exercises.map((ex: any) => {
        const lastSets = historyMap[ex.exerciseId] || []

        return {
          exerciseId: ex.exerciseId,
          exercise: ex.exercise,
          order: ex.order,
          sets: Array.from({ length: ex.sets }).map((_, i) => {
            // Pre-fill logic: use last performance data if available
            // If we have history for this set index, use it.
            // If history set count < plan set count, maybe reuse the last history set's weight?
            // For now, simple matching index.
            const historySet = lastSets[i] || (lastSets.length > 0 ? lastSets[lastSets.length - 1] : null)

            return {
              id: `temp-${ex.id}-${i}`,
              workoutExerciseId: `temp-${ex.id}`,
              setNumber: i + 1,
              reps: ex.reps || historySet?.reps || 0,
              weight: historySet?.weight || 0,
              isWarmup: false,
              rpe: ex.targetRpe || null,
              isPersonalRecord: false
            }
          })
        }
      })
    } as any // preventing strict type issues with Partial<WorkoutWithExercises>
  }

  return (
    <NewWorkoutClient
      userId={session.user.id}
      exercises={exercises}
      templateData={templateData}
      advanceActivePlan={advanceActivePlan}
      userPlans={userPlans.map((p: any) => ({ id: p.id, name: p.name }))}
      targetPlanId={targetPlanData?.plan.id}
      planName={targetPlanData?.plan.name}
      dayName={targetPlanData?.activeDay.name}
    />
  )
}
