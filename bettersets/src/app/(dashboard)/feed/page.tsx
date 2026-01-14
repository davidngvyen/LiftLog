"use client";


import React, { useState } from "react";
import { Heart, MessageCircle, Dumbbell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// import { toast } from "sonner"; 

// Use shadcn components or custom styled ones. 
// The user code uses custom styles heavily, so we'll adapt.

export default function SocialFeedPage() {
  const [activities] = useState<{
    id: string;
    user: { name: string; image: string | null };
    workout: { name: string; exerciseCount: number; duration: number; totalVolume: number };
    createdAt: string;
  }[]>([
    {
      id: "1",
      user: { name: "GymBro99", image: null },
      workout: { name: "Chest Day", exerciseCount: 5, duration: 3600000, totalVolume: 12000 },
      createdAt: new Date().toISOString()
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes}min`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold uppercase">Social Feed</h1>
        <p className="text-muted-foreground uppercase text-xs">See what your friends are up to</p>
      </div>

      {/* User Search */}
      <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h2 className="text-lg font-bold uppercase">Find Friends</h2>
        </div>

        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH..."
            className="flex-1 border-4 border-black uppercase text-xs"
          />
          <Button className="border-4 border-black bg-primary text-white hover:bg-primary/90 uppercase text-xs">
            Search
          </Button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-gradient-to-br from-primary to-orange-500 text-sm font-semibold text-white">
                {activity.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm uppercase">
                      <span className="font-bold">{activity.user.name}</span> completed a quest
                    </h4>
                    <p className="text-xs text-muted-foreground uppercase">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-2 border-black bg-secondary/50 p-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <h5 className="font-bold uppercase text-sm">{activity.workout.name}</h5>
                  </div>
                  <div className="mt-3 flex gap-6 text-xs uppercase">
                    <div>
                      <p className="text-muted-foreground">Battles</p>
                      <p className="font-bold">{activity.workout.exerciseCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-bold">
                        {formatDuration(activity.workout.duration)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Loot</p>
                      <p className="font-bold">
                        {formatVolume(activity.workout.totalVolume)} lbs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-4">
                  <Button variant="ghost" size="sm" className="uppercase text-xs">
                    <Heart className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm" className="uppercase text-xs">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
