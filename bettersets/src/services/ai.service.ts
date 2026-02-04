import { model } from '@/lib/gemini';

export interface GeneratedExercise {
  exerciseName: string;
  sets: {
    setNumber: number;
    reps: number;
    weight?: number; // 0 or undefined if bodyweight/unknown
    rpe?: number;
    isWarmup: boolean;
  }[];
}

export interface GeneratedWorkout {
  name: string;
  notes: string;
  exercises: GeneratedExercise[];
}

interface GenerateWorkoutParams {
  userGoals?: string;
  recentWorkouts?: string; // summary of recent activity
  targetMuscleGroups?: string[];
  focusAreas?: string[]; // specific emphasis (e.g., "upper chest", "glutes")
  injuries?: string[]; // constraints to work around
  durationMinutes?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string[];
}

export class AIService {
  static async generateWorkout(params: GenerateWorkoutParams): Promise<GeneratedWorkout> {
    const {
      userGoals,
      recentWorkouts,
      targetMuscleGroups,
      focusAreas,
      injuries,
      durationMinutes,
      experienceLevel,
      equipment
    } = params;

    const prompt = `
      You are a world-renowned Science-Based Hypertrophy and Strength Coach (PhD in Biomechanics/Exercise Physiology).
      Your programming is strictly based on current evidence-based guidelines (e.g., RP Hypertrophy, Helms, Nuckols).
      
      Your goal is to generate the most effective, optimized workout possible for the User Profile below.
      
      # USER PROFILE
      - **Primary Goal**: ${userGoals || 'Maximize Hypertrophy & Strength'}
      - **Experience Level**: ${experienceLevel || 'Intermediate'}
      - **Recent Activity**: ${recentWorkouts || 'Assume fully recovered.'}
      - **Injuries/Limitations**: ${injuries && injuries.length > 0 ? injuries.join(', ') : 'None. Prioritize joint health.'}

      # WORKOUT PARAMETERS
      - **Target Muscles**: ${targetMuscleGroups && targetMuscleGroups.length > 0 ? targetMuscleGroups.join(', ') : 'Full Body'}
      - **Specific Focus**: ${focusAreas && focusAreas.length > 0 ? focusAreas.join(', ') : 'Balanced development'}
      - **Duration**: ~${durationMinutes || 60} minutes
      - **Equipment**: ${equipment?.join(', ') || 'Standard Gym'}

      # SCIENCE-BASED PROGRAMMING RULES (STRICT ADHERENCE)
      1. **Exercise Selection**: Choose exercises with the best stimulus-to-fatigue ratio (SFR). Prioritize stable movements that allow high mechanical tension.
      2. **Hypertrophy Optimization**:
         - If goal is Size: Focus on full range of motion, deep stretch (long muscle length), and controlled eccentrics (2-3s).
         - Rep ranges: 6-15 reps (close to failure, RPE 7-9).
      3. **Strength Optimization**:
         - If goal is Strength: Prioritize heavy compound movements (Sq/Bnch/DL/OHP) early.
         - Rep ranges: 3-6 reps (RPE 8-9) with longer rest periods for neural recovery.
      4. **Volume Management**: Ensure systematic volume. Don't prescribe "junk volume". 
      5. **Safety**: Avoid biomechanically risky movements for the specific injuries listed.

      # INSTRUCTIONS
      - **Warmup**: Prescribe dynamic warmups specific to the first compound lift.
      - **Notes**: In the 'notes' field for exercises, explicitly mention cues like "Control the negative," "Pause at the bottom," or "Explode up" based on the goal.
      
      # JSON RESPONSE FORMAT (No Markdown)
      {
        "name": "Scientific [Muscle Group] Specialization",
        "notes": "Evidence-based strategy notes (e.g., 'Focusing on stretch-mediated hypertrophy for triceps').",
        "exercises": [
          {
            "exerciseName": "Incline Dumbbell Press",
            "sets": [
              { "setNumber": 1, "reps": 12, "weight": 0, "rpe": 7, "isWarmup": true },
              { "setNumber": 2, "reps": 8, "weight": 0, "rpe": 9, "isWarmup": false }
            ]
          }
        ]
      }
    `;

    try {
      // Use structured generation if available, or force JSON in prompt
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const response = result.response;
      let text = response.text();

      // Clean up potential markdown if the model ignores the mimeType (rare but possible)
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(text);
      return parsed as GeneratedWorkout;

    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate workout plan. Please try again.');
    }
  }
}
