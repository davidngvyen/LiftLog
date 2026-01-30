import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { PixelClouds } from "@/components/PixelClouds";
import { AppProvider } from "@/components/providers/AppProvider";
import { auth } from "@/lib/auth";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Transform session user to AppUser format
  const appUser = session?.user ? {
    id: session.user.id || "unknown",
    name: session.user.name || "Warrior",
    email: session.user.email || "",
    image: session.user.image,
  } : {
    // Fallback for non-authenticated state (restricted mode)
    id: "guest-user",
    name: "Guest Warrior",
    email: "guest@example.com",
    image: null,
  };

  return (
    <AppProvider initialUser={appUser}>
      <div className="min-h-screen bg-background">
        <PixelClouds />

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col">
          <Sidebar className="border-r-4 border-black" />
        </div>

        <div className="lg:pl-56">
          <Header />
          <main className="py-6 pb-20 lg:pb-6">
            <div className="px-4 sm:px-6 lg:px-8 relative z-10">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </AppProvider>
  );
}
