import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FeedItem as FeedItemType } from '@/services/feed.service'
// import { CharacterAvatar, CharacterCustomization } from '@/components/CharacterAvatar'
import { Clock, Dumbbell, Calendar, ChevronRight, User, Trophy } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface FeedItemProps {
    item: FeedItemType
}

export function FeedItem({ item }: FeedItemProps) {
    // Calculate total volume dynamically since it matches what the service returns (nested relations)
    // The type casting in service sucks a bit, but we know the shape.
    const exercises = (item as any).exercises || []

    const totalVolume = exercises.reduce((acc: number, ex: any) => {
        const exerciseVolume = ex?.sets?.reduce((sAcc: number, set: any) => {
            return sAcc + (set.weight * set.reps)
        }, 0) || 0
        return acc + exerciseVolume
    }, 0)

    // Format date
    const timeAgo = formatDistanceToNow(new Date(item.date), { addSuffix: true })

    // User character/avatar fallback
    //   const customization = item.user.character as CharacterCustomization || null

    const imageUrl = (item as any).imageUrl

    // Find PRs
    const prs: any[] = []
    exercises.forEach((ex: any) => {
        ex.sets.forEach((set: any) => {
            if (set.isPersonalRecord) {
                prs.push({
                    exerciseName: ex.exercise?.name,
                    weight: set.weight,
                    reps: set.reps
                })
            }
        })
    })

    return (
        <Card className="overflow-hidden border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b-2 border-black bg-gray-50 p-3">
                {/* Avatar - simplifying to fallback icon if customization is missing/complex to plumb right now without fetching */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white">
                    <User className="h-5 w-5" />
                    {/* If we had the character data in the feed response, we'd render CharacterAvatar here. 
                Service response needs to include `character` in user select to support this fully.
                For now, simple icon. */}
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <span className="font-bold uppercase text-sm">{item.user.name || 'Unknown Warrior'}</span>
                        <span className="text-muted-foreground text-xs">completed a quest</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase">{timeAgo}</span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                <h3 className="mb-3 text-lg font-black uppercase leading-tight tracking-tight">
                    {item.name}
                </h3>

                {(item as any).caption && (
                    <p className="mb-4 text-sm text-gray-700 italic border-l-4 border-primary pl-3 py-1 bg-primary/5">
                        &quot;{(item as any).caption}&quot;
                    </p>
                )}

                {/* Photo Context */}
                {imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg border-2 border-black relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt="Workout context"
                            className="aspect-video w-full object-cover"
                        />
                        {/* Linked Data Overlay */}
                        {prs.length > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-3 py-2 text-white transition-opacity">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase text-yellow-400">
                                    <Trophy className="h-3 w-3" />
                                    <span>{prs[0].exerciseName}: {prs[0].weight}lbs PR</span>
                                    {prs.length > 1 && <span className="text-white/60 text-[10px] ml-auto">+{prs.length - 1} more</span>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Row */}
                <div className="mb-4 flex gap-4 text-xs font-bold uppercase text-muted-foreground">
                    {item.durationMins && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.durationMins} MIN</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Dumbbell className="h-3 w-3" />
                        <span>{(totalVolume / 1000).toFixed(1)}k LBS VOL</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{exercises.length} Exercises</span>
                    </div>
                </div>

                {/* Exercise Summary */}
                <div className="space-y-1">
                    {exercises.slice(0, 3).map((ex: any, idx: number) => (
                        <div key={ex.id || idx} className="flex items-center justify-between rounded border-2 border-black bg-white px-2 py-1 text-xs">
                            <span className="font-bold truncate">{ex.exercise?.name || 'Unknown Exercise'}</span>
                            <span className="text-muted-foreground">{ex.sets?.length} Sets</span>
                        </div>
                    ))}
                    {exercises.length > 3 && (
                        <div className="text-[10px] text-center text-muted-foreground italic mt-1">
                            + {exercises.length - 3} more exercises
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Action */}
            <Link href={`/workouts/${item.id}`} className="block border-t-2 border-black bg-primary/10 p-2 text-center text-xs font-bold uppercase transition-colors hover:bg-primary/20">
                <div className="flex items-center justify-center gap-1">
                    View Quest Details <ChevronRight className="h-3 w-3" />
                </div>
            </Link>
        </Card>
    )
}
