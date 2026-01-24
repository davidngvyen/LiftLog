import React from "react"
import { ProgressDashboard } from "./ProgressDashboard"
import { getExercises as fetchExercises } from "@/services/exercise.service"

export default async function ProgressPage() {
  const exercises = await fetchExercises()

  return (
    <ProgressDashboard initialExercises={exercises} />
  )
}
