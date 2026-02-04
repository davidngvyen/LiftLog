import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Link from "next/link"

interface ActivePlanCardProps {
    plan: {
        id: string
        name: string
        description?: string | null
    }
    activeDayIndex: number
    activeDay: {
        id: string
        name: string
        exercises: any[]
    }
}

export default function ActivePlanCard({ plan, activeDayIndex, activeDay }: ActivePlanCardProps) {
    return (
        <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="mb-2 border-primary text-primary">
                            Up Next
                        </Badge>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>
                            Day {activeDayIndex + 1}: {activeDay.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="text-sm text-muted-foreground">
                    <p className="mb-1 font-medium text-foreground">
                        {activeDay.exercises.length} Exercises:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                        {activeDay.exercises.slice(0, 3).map((ex: any) => (
                            <li key={ex.id}>{ex.exercise.name}</li>
                        ))}
                        {activeDay.exercises.length > 3 && (
                            <li className="list-none text-xs pt-1 opacity-80">
                                + {activeDay.exercises.length - 3} more
                            </li>
                        )}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full sm:w-auto" size="lg">
                    <Link href="/workouts/new">
                        <Play className="mr-2 h-5 w-5" />
                        Start Workout
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
