import { z } from 'zod';
import { sanitizedString, cuidSchema, sanitize } from './utils';

export const setInputSchema = z.object({
  reps: z.number({ required_error: 'Reps are required' })
    .int('Reps must be a whole number')
    .min(1, 'Reps must be at least 1')
    .max(1000, 'Reps must be less than 1000'),
  weight: z.number({ required_error: 'Weight is required' })
    .min(0, 'Weight cannot be negative')
    .max(2000, 'Weight exceeds maximum limit (2000)'),
  isWarmup: z.boolean().default(false),
  rpe: z.number()
    .int()
    .min(1, 'RPE must be between 1 and 10')
    .max(10, 'RPE must be between 1 and 10')
    .optional(),
}).strict();

export const workoutExerciseInputSchema = z.object({
  exerciseId: cuidSchema,
  sets: z.array(setInputSchema)
    .min(1, 'At least one set is required')
    .max(20, 'Maximum of 20 sets per exercise allowed'),
}).strict();

export const createWorkoutSchema = z.object({
  name: z.string({ required_error: 'Workout name is required' })
    .min(1, 'Workout name is required')
    .max(100, 'Workout name must be 100 characters or less')
    .regex(/^[a-zA-Z0-9\s\-\_']+$/, 'Workout name contains invalid characters')
    .transform(sanitize),
  date: z.string({ required_error: 'Date is required' })
    .datetime({ message: 'Invalid date format' }),
  notes: sanitizedString(0, 1000, 'Notes').optional().or(z.literal('')),
  exercises: z.array(workoutExerciseInputSchema)
    .min(1, 'At least one exercise is required')
    .max(50, 'Maximum of 50 exercises per workout allowed'),
}).strict();
