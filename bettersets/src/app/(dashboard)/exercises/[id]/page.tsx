
import { notFound } from "next/navigation";
import { getExerciseById } from "@/services/exercise.service";
import { ExerciseDiagram } from "@/components/exercise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ExercisePage({ params }: PageProps) {
    const { id } = await params;
    const exercise = await getExerciseById(id);

    if (!exercise) {
        notFound();
    }

    return (
        <div className="container max-w-4xl mx-auto py-6 px-4 space-y-8 animate-in fade-in duration-500">
            {/* Header & Navigation */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/exercises">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{exercise.name}</h1>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs uppercase tracking-wider">{exercise.muscleGroup}</Badge>
                        <Badge variant="outline" className="text-xs uppercase tracking-wider">{exercise.category}</Badge>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-[40%_1fr]">
                {/* Left Column: Visuals */}
                <div className="space-y-6">
                    <ExerciseDiagram
                        imageUrl={exercise.diagramUrl}
                        altText={`Diagram showing how to perform ${exercise.name}`}
                    />

                    {exercise.tips && (
                        <Card className="bg-amber-500/10 border-amber-500/20 shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-amber-600 dark:text-amber-400 text-lg flex items-center gap-2">
                                    💡 Pro Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                                    {exercise.tips.split('\n').filter((tip: string) => tip.trim()).map((tip: string, index: number) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Instructions */}
                <div className="space-y-6">
                    {exercise.equipment && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                            <span className="font-medium text-foreground">Equipment:</span>
                            {exercise.equipment}
                        </div>
                    )}

                    <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                                    {exercise.instructions}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
