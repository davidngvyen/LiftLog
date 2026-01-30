import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const query = searchParams.get("query")

        if (!query) {
            return NextResponse.json([])
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        id: {
                            not: session.user.id,
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                image: true,
                bio: true,
            },
            take: 10,
        })

        // Also fetch following status for these users
        const following = await prisma.follow.findMany({
            where: {
                followerId: session.user.id,
                followingId: {
                    in: users.map((u: { id: string }) => u.id)
                }
            },
            select: {
                followingId: true
            }
        })

        const followingIds = new Set(following.map((f: { followingId: string }) => f.followingId))

        const usersWithStatus = users.map((user: { id: string, name: string | null, image: string | null, bio: string | null }) => ({
            ...user,
            isFollowing: followingIds.has(user.id)
        }))

        return NextResponse.json(usersWithStatus)
    } catch (error) {
        console.error("Error searching users:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
