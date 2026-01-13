export type Set = {
  id: string
  reps: number
  weight?: number
}

export type Exercise = {
  id: string
  name: string
  sets: Set[]
}

export type Workout = {
  id: string
  name: string
  userId: string
  exercises: Exercise[]
  createdAt: string
}
