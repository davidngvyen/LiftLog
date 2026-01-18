import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
            process.env[key] = value;
        }
    });
    console.log("Loaded environment variables from", envPath);
    console.log("DATABASE_URL is set:", !!process.env.DATABASE_URL);
} else {
    console.warn("⚠️ .env file not found at", envPath);
    console.log("Current directory:", process.cwd());
}

const prisma = new PrismaClient();

async function main() {
    console.log("🔒 Securing database with RLS policies...");

    try {
        // 1. User Table
        await prisma.$executeRaw`ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Users can manage their own data" ON "User";`;
        await prisma.$executeRaw`CREATE POLICY "Users can manage their own data" ON "User" FOR ALL USING (auth.uid()::text = id);`;
        console.log("✅ Secured User table");

        // 2. Account Table
        await prisma.$executeRaw`ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Users can manage their own accounts" ON "Account";`;
        await prisma.$executeRaw`CREATE POLICY "Users can manage their own accounts" ON "Account" FOR ALL USING (auth.uid()::text = "userId");`;
        console.log("✅ Secured Account table");

        // 3. Session Table
        await prisma.$executeRaw`ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Users can manage their own sessions" ON "Session";`;
        await prisma.$executeRaw`CREATE POLICY "Users can manage their own sessions" ON "Session" FOR ALL USING (auth.uid()::text = "userId");`;
        console.log("✅ Secured Session table");

        // 4. Exercise Table (Public Read, Admin Write)
        await prisma.$executeRaw`ALTER TABLE "Exercise" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Exercises are public to read" ON "Exercise";`;
        await prisma.$executeRaw`CREATE POLICY "Exercises are public to read" ON "Exercise" FOR SELECT USING (true);`;
        // No policy for write = Service Role only
        console.log("✅ Secured Exercise table");

        // 5. Workout Table
        await prisma.$executeRaw`ALTER TABLE "Workout" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Users can manage their own workouts" ON "Workout";`;
        await prisma.$executeRaw`CREATE POLICY "Users can manage their own workouts" ON "Workout" FOR ALL USING (auth.uid()::text = "userId");`;
        console.log("✅ Secured Workout table");

        // 6. WorkoutExercise Table (Linked to Workout)
        await prisma.$executeRaw`ALTER TABLE "WorkoutExercise" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Users manage their workout exercises" ON "WorkoutExercise";`;
        await prisma.$executeRaw`CREATE POLICY "Users manage their workout exercises" ON "WorkoutExercise" FOR ALL USING (
      auth.uid()::text = (
        SELECT "userId" FROM "Workout" WHERE "Workout".id = "WorkoutExercise"."workoutId"
      )
    );`;
        console.log("✅ Secured WorkoutExercise table");

        // 7. Set Table (Linked to WorkoutExercise -> Workout)
        await prisma.$executeRaw`ALTER TABLE "Set" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Users manage their sets" ON "Set";`;
        // Complex join for policy
        await prisma.$executeRaw`CREATE POLICY "Users manage their sets" ON "Set" FOR ALL USING (
      auth.uid()::text = (
        SELECT w."userId" 
        FROM "Workout" w 
        JOIN "WorkoutExercise" we ON we."workoutId" = w.id 
        WHERE we.id = "Set"."workoutExerciseId"
      )
    );`;
        console.log("✅ Secured Set table");

        // 8. Follow Table
        await prisma.$executeRaw`ALTER TABLE "Follow" ENABLE ROW LEVEL SECURITY;`;
        await prisma.$executeRaw`DROP POLICY IF EXISTS "Users manage their follows" ON "Follow";`;
        await prisma.$executeRaw`CREATE POLICY "Users manage their follows" ON "Follow" FOR ALL USING (auth.uid()::text = "followerId");`;
        console.log("✅ Secured Follow table");

        // 9. Sensitive/System Tables (Service Role Only)
        // By enabling RLS and adding NO policies, we deny all public access
        const systemTables = ["RateLimitLog", "VerificationToken", "_prisma_migrations"];
        for (const table of systemTables) {
            await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
            console.log(`✅ Secured ${table} table (Service Role Only)`);
        }

        console.log("\n🎉 Successfully enabled RLS and applied policies.");
    } catch (error: any) {
        const fs = require('fs');
        const errorMessage = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        fs.writeFileSync('scripts/error_log.txt', errorMessage);
        console.error("❌ Error applying RLS policies. See scripts/error_log.txt");
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

