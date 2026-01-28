import { Card } from '@/components/ui/card'
import { CharacterAvatar, CharacterCustomization } from '@/components/CharacterAvatar'
import { FollowButton } from './FollowButton'
import { Trophy } from 'lucide-react'

interface UserCardProps {
    user: {
        id: string
        name: string | null
        workoutCount: number
        character: CharacterCustomization | null
        bio?: string | null
        _count?: {
            followers: number
        }
    }
    isFollowing?: boolean
    currentUserId: string
}

export function UserCard({ user, isFollowing = false, currentUserId }: UserCardProps) {
    const userLevel = Math.floor((user.workoutCount || 0) / 5) + 1;
    // Default customization if none exists
    const customization: CharacterCustomization = user.character || {
        skinColor: "#ffd5b5",
        hairStyle: "short",
        hairColor: "#654321",
        clothesStyle: "tshirt",
        clothesColor: "#3b82f6",
    }

    const isMe = user.id === currentUserId

    return (
        <Card className="flex flex-col overflow-hidden border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {/* Banner / Header Background */}
            <div className="h-16 w-full bg-gradient-to-r from-cyan-400 to-blue-500 border-b-4 border-black relative">
            </div>

            <div className="flex flex-col items-center px-4 pb-4 -mt-10">
                <div className="relative z-10">
                    <CharacterAvatar customization={customization} size="lg" />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                        LVL {userLevel}
                    </div>
                </div>

                <div className="mt-3 text-center w-full">
                    <h3 className="font-bold text-lg uppercase truncate leading-tight">{user.name || 'Unknown Warrior'}</h3>

                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1 mb-3">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span>{user.workoutCount} Quests</span>
                        <span className="mx-1">•</span>
                        <span>{user._count?.followers || 0} Followers</span>
                    </div>

                    {user.bio && (
                        <p className="text-xs text-center text-gray-600 line-clamp-2 mb-4 px-2 italic">
                            "{user.bio}"
                        </p>
                    )}

                    {!isMe && (
                        <div className="mt-auto w-full">
                            <FollowButton
                                targetUserId={user.id}
                                initialIsFollowing={isFollowing}
                                width="full"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
