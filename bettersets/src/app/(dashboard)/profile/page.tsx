"use client";

import React, { useEffect, useState } from "react";
import { LogOut, Edit, Palette, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/components/providers/AppProvider";
import { signOut } from "next-auth/react";
// import { toast } from "sonner";
import {
    CharacterAvatar,
    skinColors,
    hairStyles,
    hairColors,
    clothesStyles,
    clothesColors,
    CharacterCustomization
} from "@/components/CharacterAvatar";

export default function ProfilePage() {
    const { user, updateCharacter } = useApp();
    const [editing, setEditing] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [tempCustomization, setTempCustomization] = useState<CharacterCustomization>(
        (user?.character as CharacterCustomization) || {
            skinColor: "#ffd5b5",
            hairStyle: "short",
            hairColor: "#654321",
            clothesStyle: "tshirt",
            clothesColor: "#3b82f6",
        }
    );

    // Sync state with user context if it loads late


    const userLevel = Math.floor((user?.workoutCount || 0) / 5) + 1;

    const saveProfile = async () => {
        // In real app, call API
        setEditing(false);
        // toast.success("Profile updated!");
    };

    const saveCharacter = () => {
        updateCharacter(tempCustomization);
        setEditingCharacter(false);
        // toast.success("Character updated!");
    };

    const formatVolume = (volume: number) => {
        if (volume >= 1000) {
            return `${(volume / 1000).toFixed(1)}K`;
        }
        return volume.toFixed(0);
    };

    return (
        <div key={user?.id || 'loading'} className="space-y-6 pb-20 lg:pb-6">
            {/* Character Customization Header */}
            <div className="border-4 border-black bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="border-2 border-black bg-white p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        {/* Character Avatar */}
                        <div className="flex flex-col items-center gap-2">
                            <CharacterAvatar customization={tempCustomization} size="xl" />
                            <Button
                                onClick={() => setEditingCharacter(!editingCharacter)}
                                variant="outline"
                                size="sm"
                                className="mt-2 border-2 border-black uppercase text-xs hover:bg-gray-100"
                            >
                                <Palette className="mr-2 h-4 w-4" />
                                CUSTOMIZE
                            </Button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center sm:text-left">
                            {editing ? (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="uppercase font-bold text-xs">WARRIOR NAME</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 border-4 border-black bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bio" className="uppercase font-bold text-xs">BIO</Label>
                                        <textarea
                                            id="bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="TELL US ABOUT YOURSELF..."
                                            className="mt-1 w-full border-4 border-black p-2 text-sm bg-gray-50 min-h-[80px]"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-center sm:justify-start">
                                        <Button onClick={saveProfile} className="border-4 border-black bg-primary text-white hover:bg-primary/90 uppercase text-xs">SAVE</Button>
                                        <Button variant="outline" onClick={() => setEditing(false)} className="border-4 border-black uppercase text-xs">
                                            CANCEL
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl uppercase leading-relaxed font-bold">{user?.name}</h2>
                                    <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        <p className="text-sm uppercase leading-relaxed">LEVEL {userLevel} WARRIOR</p>
                                    </div>
                                    {bio && <p className="mt-2 text-xs uppercase leading-relaxed text-muted-foreground">{bio}</p>}
                                    <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                                        <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="border-2 border-black uppercase text-xs hover:bg-gray-100">
                                            <Edit className="mr-2 h-4 w-4" />
                                            EDIT
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => signOut()} className="border-2 border-black uppercase text-xs hover:bg-red-50 text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            LOGOUT
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Character Customization Panel */}
            {editingCharacter && (
                <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="mb-4 text-base uppercase leading-relaxed font-bold">🎨 CHARACTER CUSTOMIZATION</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Preview */}
                        <div className="flex flex-col items-center gap-4">
                            <CharacterAvatar customization={tempCustomization} size="xl" />
                            <Button onClick={saveCharacter} className="w-full border-4 border-black bg-green-500 text-white hover:bg-green-600 uppercase text-xs">
                                SAVE CHARACTER
                            </Button>
                        </div>

                        {/* Customization Options */}
                        <div className="space-y-4">
                            {/* Skin Color */}
                            <div>
                                <Label className="uppercase font-bold text-xs">SKIN COLOR</Label>
                                <div className="mt-2 grid grid-cols-5 gap-2">
                                    {skinColors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() =>
                                                setTempCustomization({ ...tempCustomization, skinColor: color.value })
                                            }
                                            className={`h-12 border-4 border-black transition-all hover:scale-110 ${tempCustomization.skinColor === color.value
                                                ? "ring-4 ring-primary ring-offset-2"
                                                : ""
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Hair Style */}
                            <div>
                                <Label className="uppercase font-bold text-xs">HAIR STYLE</Label>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {hairStyles.map((style) => (
                                        <button
                                            key={style.value}
                                            onClick={() =>
                                                setTempCustomization({ ...tempCustomization, hairStyle: style.value })
                                            }
                                            className={`border-2 border-black bg-secondary p-2 text-xs uppercase transition-all hover:bg-accent ${tempCustomization.hairStyle === style.value
                                                ? "ring-4 ring-primary"
                                                : ""
                                                }`}
                                        >
                                            {style.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Hair Color */}
                            <div>
                                <Label className="uppercase font-bold text-xs">HAIR COLOR</Label>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {hairColors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() =>
                                                setTempCustomization({ ...tempCustomization, hairColor: color.value })
                                            }
                                            className={`h-10 border-4 border-black transition-all hover:scale-110 ${tempCustomization.hairColor === color.value
                                                ? "ring-4 ring-primary ring-offset-2"
                                                : ""
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Clothes Style */}
                            <div>
                                <Label className="uppercase font-bold text-xs">OUTFIT</Label>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {clothesStyles.map((style) => {
                                        return (
                                            <button
                                                key={style.value}
                                                onClick={() =>
                                                    setTempCustomization({ ...tempCustomization, clothesStyle: style.value })
                                                }
                                                className={`relative border-2 border-black bg-secondary p-2 text-xs uppercase transition-all hover:bg-accent ${tempCustomization.clothesStyle === style.value
                                                    ? "ring-4 ring-primary"
                                                    : ""
                                                    }`}
                                            >
                                                {style.name}
                                                <div className="text-[10px] text-muted-foreground">
                                                    LVL {style.level}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Clothes Color */}
                            <div>
                                <Label className="uppercase font-bold text-xs">OUTFIT COLOR</Label>
                                <div className="mt-2 grid grid-cols-5 gap-2">
                                    {clothesColors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() =>
                                                setTempCustomization({ ...tempCustomization, clothesColor: color.value })
                                            }
                                            className={`h-10 border-4 border-black transition-all hover:scale-110 ${tempCustomization.clothesColor === color.value
                                                ? "ring-4 ring-primary ring-offset-2"
                                                : ""
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unlock Info */}
                    <div className="mt-6 border-4 border-black bg-gradient-to-r from-yellow-200 to-orange-200 p-4">
                        <p className="text-xs uppercase leading-relaxed font-bold">
                            🔓 UNLOCK NEW GEAR BY LEVELING UP! COMPLETE QUESTS TO EARN XP AND UNLOCK EXCLUSIVE OUTFITS.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="mb-4 text-base uppercase leading-relaxed font-bold">⚔️ PLAYER STATS</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="🎯 QUESTS"
                        value={user?.workoutCount || 0}
                    />
                    <StatCard
                        title="💪 POWER"
                        value={formatVolume(user?.totalVolume || 0)}
                        unit="LBS"
                    />
                    <StatCard
                        title="🔥 STREAK"
                        value={user?.currentStreak || 0}
                        unit="DAYS"
                    />
                    <StatCard
                        title="👥 FRIENDS"
                        value={stats?.followersCount || 0}
                    />
                </div>
            </div>
        </div>
    );
}

// Temporary stats for followers (or we can add to User context)
const stats = { followersCount: 12 };

function StatCard({
    title,
    value,
    unit,
}: {
    title: string;
    value: string | number;
    unit?: string;
}) {
    return (
        <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs uppercase leading-relaxed text-muted-foreground font-bold">{title}</p>
            <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-normal leading-relaxed">{value}</span>
                {unit && <span className="text-sm font-normal leading-relaxed text-muted-foreground">{unit}</span>}
            </div>
        </div>
    );
}
