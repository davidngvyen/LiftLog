import { auth } from "@/lib/auth"
import { getExercises } from "@/services/exercise.service"
import { getWorkoutById } from "@/services/workout.service"
import { notFound, redirect } from "next/navigation"
import WorkoutDetailsClient from "./WorkoutDetailsClient"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WorkoutPage({ params }: PageProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const [workout, exercises] = await Promise.all([
    getWorkoutById(id),
    getExercises()
  ])

  if (!workout) {
    notFound()
  }

  // Verify ownership
  if (workout.userId !== session.user.id) {
    // Optionally redirect to 403 or just notFound
    notFound()
  }

  return (
    <WorkoutDetailsClient
      workout={workout}
      allExercises={exercises}
      userId={session.user.id}
    />
  )
}

