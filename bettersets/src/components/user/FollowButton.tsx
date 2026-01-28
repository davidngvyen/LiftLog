'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
    targetUserId: string
    initialIsFollowing: boolean
    className?: string
    width?: "full" | "auto" // 'full' for full width on cards, 'auto' for inline
}

export function FollowButton({
    targetUserId,
    initialIsFollowing,
    className,
    width = "auto"
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isLoading, setIsLoading] = useState(false)

    const handleFollowToggle = async () => {
        setIsLoading(true)
        const previousState = isFollowing

        // Optimistic update
        setIsFollowing(!isFollowing)

        try {
            const response = await fetch(`/api/users/${targetUserId}/follow`, {
                method: isFollowing ? 'DELETE' : 'POST',
            })

            if (!response.ok) {
                throw new Error('Failed to update follow status')
            }

            // Optional: Toast on success
            // toast.success(isFollowing ? 'Unfollowed' : 'Followed') 

        } catch (error) {
            console.error('Follow action failed:', error)
            // Revert state on error
            setIsFollowing(previousState)
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleFollowToggle}
            disabled={isLoading}
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className={cn(
                "uppercase text-xs font-bold border-2 border-black transition-all",
                // Distinct styles for follow vs unfollow
                isFollowing
                    ? "bg-white text-black hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                width === "full" ? "w-full" : "",
                className
            )}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : isFollowing ? (
                <UserMinus className="mr-2 h-3 w-3" />
            ) : (
                <UserPlus className="mr-2 h-3 w-3" />
            )}
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    )
}
