'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { FeedItem as FeedItemType, FeedResponse } from '@/services/feed.service'
import { FeedItem } from './FeedItem'
import { Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function FeedList() {
    const [items, setItems] = useState<FeedItemType[]>([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [initialized, setInitialized] = useState(false)

    const observerTarget = useRef<HTMLDivElement>(null)

    const fetchFeed = useCallback(async (currentCursor?: string | null) => {
        if (loading) return
        setLoading(true)

        try {
            const params = new URLSearchParams({ limit: '20' })
            if (currentCursor) params.append('cursor', currentCursor)

            const res = await fetch(`/api/feed?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch feed')

            const data: FeedResponse = await res.json()

            setItems((prev) => currentCursor ? [...prev, ...data.items] : data.items)
            setCursor(data.nextCursor)
            setHasMore(!!data.nextCursor)
        } catch (error) {
            console.error('Error loading feed:', error)
        } finally {
            setLoading(false)
            setInitialized(true)
        }
    }, [loading]) // Added loading to dependency to prevent double fetch, though internally guarded.

    // Initial load
    useEffect(() => {
        if (!initialized) {
            fetchFeed()
        }
    }, [initialized, fetchFeed])

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    fetchFeed(cursor)
                }
            },
            { threshold: 0.5 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [hasMore, loading, cursor, fetchFeed])

    if (!initialized && loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (initialized && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                <div className="mb-4 rounded-full bg-gray-100 p-4 border-2 border-black">
                    <Users className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">No activity yet</h3>
                <p className="text-muted-foreground mb-6 max-w-xs text-sm">
                    Follow other warriors to see their quests here.
                </p>
                {/* Assuming there is a users search page, linking to search/users or similar. 
                If not, we can just leave it as text or link to the main dashboard to start working out. 
                I'll guess /search as a placeholder or just homepage. */}
                <Button asChild className="uppercase font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Link href="/">Find Warriors</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {items.map((item) => (
                <FeedItem key={item.id} item={item} />
            ))}

            {/* Sentinel for infinite scroll */}
            <div ref={observerTarget} className="flex justify-center py-4 h-10">
                {loading && hasMore && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
            </div>

            {!hasMore && items.length > 0 && (
                <div className="text-center text-xs text-muted-foreground uppercase py-4 font-bold">
                    No more quests to show
                </div>
            )}
        </div>
    )
}
