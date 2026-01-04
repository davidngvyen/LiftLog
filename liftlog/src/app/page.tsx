import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to LiftLog
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A fitness tracking app starter. Use the dashboard to manage workouts and track progress.
          </p>
          <div className="flex gap-4 mt-4">
            <Link className="underline" href="/(dashboard)/dashboard">Dashboard</Link>
            <Link className="underline" href="/(auth)/login">Login</Link>
            <Link className="underline" href="/(auth)/register">Register</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
