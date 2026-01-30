-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Exercise" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkoutExercise" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Set" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Follow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RateLimitLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- 1. USER
DROP POLICY IF EXISTS "Public profiles" ON "User";
CREATE POLICY "Public profiles" ON "User" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON "User";
CREATE POLICY "Users can update own profile" ON "User" FOR UPDATE USING ((select auth.uid())::text = id);

-- 2. WORKOUTS
DROP POLICY IF EXISTS "Workouts are public" ON "Workout";
CREATE POLICY "Workouts are public" ON "Workout" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create own workouts" ON "Workout";
CREATE POLICY "Users can create own workouts" ON "Workout" FOR INSERT WITH CHECK ((select auth.uid())::text = "userId");

DROP POLICY IF EXISTS "Users can update own workouts" ON "Workout";
CREATE POLICY "Users can update own workouts" ON "Workout" FOR UPDATE USING ((select auth.uid())::text = "userId");

DROP POLICY IF EXISTS "Users can delete own workouts" ON "Workout";
CREATE POLICY "Users can delete own workouts" ON "Workout" FOR DELETE USING ((select auth.uid())::text = "userId");

-- 3. EXERCISES
DROP POLICY IF EXISTS "Exercises are public" ON "Exercise";
CREATE POLICY "Exercises are public" ON "Exercise" FOR SELECT USING (true);

-- 4. WORKOUT DETAILS (WorkoutExercise, Set)
DROP POLICY IF EXISTS "Workout details are public" ON "WorkoutExercise";
CREATE POLICY "Workout details are public" ON "WorkoutExercise" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sets are public" ON "Set";
CREATE POLICY "Sets are public" ON "Set" FOR SELECT USING (true);

-- Allow creators to modify. We verify that the user owns the parent Workout.
DROP POLICY IF EXISTS "Auth users can insert details" ON "WorkoutExercise";
CREATE POLICY "Auth users can insert details" ON "WorkoutExercise" FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM "Workout"
    WHERE id = "workoutId" AND "userId" = (select auth.uid())::text
  )
);

DROP POLICY IF EXISTS "Auth users can insert sets" ON "Set";
CREATE POLICY "Auth users can insert sets" ON "Set" FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM "WorkoutExercise" we
    JOIN "Workout" w ON we."workoutId" = w.id
    WHERE we.id = "workoutExerciseId" AND w."userId" = (select auth.uid())::text
  )
);

-- 5. SOCIAL (Follow)
DROP POLICY IF EXISTS "Follows are public" ON "Follow";
CREATE POLICY "Follows are public" ON "Follow" FOR SELECT USING (true);

-- Clean up acts-as-all policy
DROP POLICY IF EXISTS "Users can manage follows" ON "Follow";

DROP POLICY IF EXISTS "Users can create follows" ON "Follow";
CREATE POLICY "Users can create follows" ON "Follow" FOR INSERT WITH CHECK ((select auth.uid())::text = "followerId");

DROP POLICY IF EXISTS "Users can delete follows" ON "Follow";
CREATE POLICY "Users can delete follows" ON "Follow" FOR DELETE USING ((select auth.uid())::text = "followerId");

-- 6. PRIVATE TABLES (Account, Session, VerificationToken, RateLimitLog, _prisma_migrations)
-- NO POLICIES defined means DENY ALL by default for the API.
-- This effectively hides these sensitive tables from the public internet.

