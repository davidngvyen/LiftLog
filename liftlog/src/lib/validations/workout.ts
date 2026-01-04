import { z } from 'zod'
import { sanitize } from '@/lib/security/sanitize'

export const setInputSchema = z
  .object({
    reps: z.number().int().min(1).max(1000),
    weight: z.number().min(0).max(5000).optional(),
  })
  .strict()

export const exerciseInputSchema = z
  .object({
    name: z.string().min(1).max(100).trim(),
    sets: z.array(setInputSchema).min(1).max(50),
  })
  .strict()

export const createWorkoutSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Workout title is required')
      .max(100, 'Workout title must be 100 characters or less')
      .trim()
      .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Invalid characters'),
    date: z.string().datetime().optional(),
    notes: z
      .string()
      .max(1000, 'Notes must be 1000 characters or less')
      .optional()
      .transform((val) => (val ? sanitize(val) : val)),
    exercises: z.array(exerciseInputSchema).min(1).max(50),
  })
  .strict()
