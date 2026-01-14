"use client";

import React from "react";
import { TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockRecords = [
  { exerciseId: "1", exerciseName: "Bench Press", weight: 225, date: new Date().toISOString() },
  { exerciseId: "2", exerciseName: "Squat", weight: 315, date: new Date().toISOString() },
  { exerciseId: "3", exerciseName: "Deadlift", weight: 405, date: new Date().toISOString() }
];

const mockHistory = [
  { date: "Jan 1", weight: 185, volume: 5000 },
  { date: "Jan 8", weight: 195, volume: 5500 },
  { date: "Jan 15", weight: 205, volume: 5800 },
  { date: "Jan 22", weight: 215, volume: 6200 },
  { date: "Jan 29", weight: 225, volume: 6500 },
];

export default function ProgressPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold uppercase">Progress Tracking</h1>
        <p className="text-muted-foreground uppercase text-xs">Monitor your improvements over time</p>
      </div>

      {/* Personal Records */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mockRecords.map((record) => (
              <button
                key={record.exerciseId}
                className="rounded-xl border-2 border-black p-4 text-left transition-all hover:bg-primary/5 hover:translate-x-1"
              >
                <h4 className="font-bold uppercase text-sm">{record.exerciseName}</h4>
                <p className="mt-2 text-2xl font-bold text-primary font-mono">{record.weight} lbs</p>
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  {new Date(record.date).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Progress Chart */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Bench Press Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase">Weight Progression</h4>
              <div className="h-[300px] w-full border-2 border-black bg-white p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#000" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                    <YAxis stroke="#000" tick={{ fontFamily: 'monospace', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #000",
                        fontFamily: "monospace",
                        textTransform: "uppercase"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#ff6b35"
                      strokeWidth={3}
                      dot={{ fill: "#ff6b35", r: 5, strokeWidth: 2, stroke: "#000" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
