"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, TrendingUp, Users, User } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";

export function MobileNav() {
    const pathname = usePathname();
    const { } = useApp();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg lg:hidden">
                <div className="flex items-center justify-around px-2 py-2">
                    <MobileNavItem
                        href="/dashboard"
                        icon={Home}
                        label="Home"
                        active={pathname === "/dashboard"}
                    />
                    <MobileNavItem
                        href="/workouts"
                        icon={Dumbbell}
                        label="Workout"
                        active={isActive("/workouts")}
                    />
                    <MobileNavItem
                        href="/progress"
                        icon={TrendingUp}
                        label="Progress"
                        active={isActive("/progress")}
                    />
                    <MobileNavItem
                        href="/feed"
                        icon={Users}
                        label="Social"
                        active={isActive("/feed")}
                    />
                    <MobileNavItem
                        href="/profile"
                        icon={User}
                        label="Profile"
                        active={isActive("/profile")}
                    />
                </div>
            </nav>


        </>
    );
}

function MobileNavItem({
    href,
    icon: Icon,
    label,
    active,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-all ${active ? "text-primary" : "text-muted-foreground"
                }`}
        >
            <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 2} />
            <span className="text-xs font-medium">{label}</span>
        </Link>
    );
}
