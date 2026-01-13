"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, TrendingUp, Users, Plus, Menu } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider"; // Assuming this exists and works
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { user } = useApp();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    return (
        <div className={cn("flex h-full flex-col gap-y-5 overflow-y-auto bg-card px-4 pb-4", className)}>
            <div className="flex h-16 shrink-0 items-start gap-2 pt-4">
                <div className="flex h-8 w-8 items-center justify-center border-4 border-black bg-gradient-to-br from-primary via-orange-500 to-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Dumbbell className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-normal uppercase leading-tight">Better<br />Sets</span>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-2">
                            <NavItem
                                href="/dashboard"
                                icon={Home}
                                label="Dashboard"
                                active={pathname === "/dashboard"}
                            />
                            <NavItem
                                href="/workouts"
                                icon={Dumbbell}
                                label="Workout"
                                active={pathname === "/workouts"}
                            />
                            <NavItem
                                href="/exercises"
                                icon={Menu} // Using Menu icon as placeholder if Exercises specific icon missing, originally it was Menu in AppSidebar
                                label="Exercises"
                                active={pathname === "/exercises"}
                            />
                            <NavItem
                                href="/progress"
                                icon={TrendingUp}
                                label="Progress"
                                active={pathname === "/progress"}
                            />
                            <NavItem
                                href="/feed"
                                icon={Users}
                                label="Social"
                                active={pathname === "/feed"}
                            />
                            <NavItem
                                href="/ai"
                                icon={Plus}
                                label="AI Generator"
                                active={pathname === "/ai"}
                            />
                        </ul>
                    </li>
                    <li className="mt-auto">
                        {user && (
                            <Link
                                href="/profile"
                                className={cn(
                                    "group flex w-full items-center gap-x-3 border-4 border-black p-2 text-xs uppercase leading-relaxed transition-all",
                                    isActive("/profile")
                                        ? "bg-gradient-to-r from-primary/20 to-orange-500/20 text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-gradient-to-br from-primary to-orange-500 text-sm font-normal text-white">
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="truncate">{user.name}</span>
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    );
}

function NavItem({
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
        <li>
            <Link
                href={href}
                className={cn(
                    "group flex w-full items-center gap-x-2 border-4 border-black p-2 text-xs uppercase leading-relaxed transition-all",
                    active
                        ? "bg-gradient-to-r from-primary/20 to-orange-500/20 text-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
            >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
            </Link>
        </li>
    );
}
