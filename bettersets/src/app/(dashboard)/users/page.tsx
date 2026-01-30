"use client";

import { useState } from "react";
import { Loader2, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FollowButton } from "@/components/user/FollowButton";
import { Button } from "@/components/ui/button";

interface UserResult {
    id: string;
    name: string;
    image: string | null;
    bio: string | null;
    isFollowing: boolean;
}

export default function UsersPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`/api/users?query=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-black uppercase tracking-tight italic mb-2">
                    Find Warriors
                </h1>
                <p className="text-muted-foreground">
                    Search for friends and fellow lifters to follow.
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="pl-9 h-12"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 border-2 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
            </form>

            <div className="space-y-4">
                {results.length > 0 ? (
                    results.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full border border-black overflow-hidden shrink-0">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold">{user.name}</h3>
                                    {user.bio && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">{user.bio}</p>
                                    )}
                                </div>
                            </div>
                            <FollowButton
                                targetUserId={user.id}
                                initialIsFollowing={user.isFollowing}
                            />
                        </div>
                    ))
                ) : searched && !loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No warriors found. Try a different name.
                    </div>
                ) : null}
            </div>
        </div>
    );
}
