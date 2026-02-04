'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type CreatePlanInput = {
    name: string
    description?: string
    days: {
        name: string
        order: number
        exercises: {
            exerciseId: string
            order: number
            sets: number
            reps?: number
            duration?: number
            notes?: string
            targetRpe?: number
        }[]
    }[]
}

export async function createWorkoutPlan(userId: string, data: CreatePlanInput) {
    try {
        const plan = await prisma.workoutPlan.create({
            data: {
                userId,
                name: data.name,
                description: data.description,
                days: {
                    create: data.days.map((day) => ({
                        name: day.name,
                        order: day.order,
                        exercises: {
                            create: day.exercises.map((ex) => ({
                                exerciseId: ex.exerciseId,
                                order: ex.order,
                                sets: ex.sets,
                                reps: ex.reps,
                                duration: ex.duration,
                                notes: ex.notes,
                                targetRpe: ex.targetRpe,
                            })),
                        },
                    })),
                },
            },
            include: {
                days: {
                    include: {
                        exercises: true
                    }
                }
            }
        })

        revalidatePath('/plans')
        return plan
    } catch (error) {
        console.error('Error creating workout plan:', error)
        throw error
    }
}

export async function getPlanById(planId: string) {
    try {
        const plan = await prisma.workoutPlan.findUnique({
            where: { id: planId },
            include: {
                days: {
                    orderBy: { order: 'asc' },
                    include: {
                        exercises: {
                            orderBy: { order: 'asc' },
                            include: { exercise: true }
                        }
                    }
                }
            }
        })
        return plan
    } catch (error) {
        console.error('Error fetching plan by id:', error)
        return null
    }
}

export async function updateWorkoutPlan(userId: string, planId: string, data: CreatePlanInput) {
    try {
        // First verify ownership
        const existing = await prisma.workoutPlan.findUnique({
            where: { id: planId },
        })

        if (!existing || existing.userId !== userId) {
            throw new Error('Plan not found or unauthorized')
        }

        const plan = await prisma.workoutPlan.update({
            where: { id: planId },
            data: {
                name: data.name,
                description: data.description,
                days: {
                    deleteMany: {},
                    create: data.days.map((day) => ({
                        name: day.name,
                        order: day.order,
                        exercises: {
                            create: day.exercises.map((ex) => ({
                                exerciseId: ex.exerciseId,
                                order: ex.order,
                                sets: ex.sets,
                                reps: ex.reps,
                                duration: ex.duration,
                                notes: ex.notes,
                                targetRpe: ex.targetRpe,
                            })),
                        },
                    })),
                },
            },
            include: {
                days: {
                    include: {
                        exercises: true
                    }
                }
            }
        })

        revalidatePath('/plans')
        revalidatePath(`/plans/${planId}`)
        return plan
    } catch (error) {
        console.error('Error updating workout plan:', error)
        throw error
    }
}

export async function getUserPlans(userId: string) {
    try {
        return await prisma.workoutPlan.findMany({
            where: { userId },
            include: {
                days: {
                    orderBy: { order: 'asc' },
                    include: {
                        exercises: {
                            orderBy: { order: 'asc' },
                            include: { exercise: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.error('Error fetching user plans:', error)
        return []
    }
}

export async function getActivePlan(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { activePlanId: true, activeDayIndex: true }
        })

        if (!user?.activePlanId) return null

        const plan = await prisma.workoutPlan.findUnique({
            where: { id: user.activePlanId },
            include: {
                days: {
                    orderBy: { order: 'asc' },
                    include: {
                        exercises: {
                            orderBy: { order: 'asc' },
                            include: { exercise: true }
                        }
                    }
                }
            }
        })

        if (!plan) return null

        return {
            plan,
            activeDayIndex: user.activeDayIndex || 0,
            activeDay: plan.days.find(d => d.order === (user.activeDayIndex || 0)) || plan.days[0]
        }
    } catch (error) {
        console.error('Error fetching active plan:', error)
        return null
    }
}

export async function setActivePlan(userId: string, planId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                activePlanId: planId,
                activeDayIndex: 0
            }
        })
        revalidatePath('/workouts')
        return { success: true }
    } catch (error) {
        console.error('Error setting active plan:', error)
        throw error
    }
}

export async function advancePlanDay(userId: string) {
    try {
        const activeData = await getActivePlan(userId)
        if (!activeData) return

        const currentDayIndex = activeData.activeDayIndex
        const totalDays = activeData.plan.days.length

        // Loop logic: (current + 1) % total
        const nextDayIndex = (currentDayIndex + 1) % totalDays

        await prisma.user.update({
            where: { id: userId },
            data: {
                activeDayIndex: nextDayIndex
            }
        })

        revalidatePath('/workouts')
        return { success: true, nextDayIndex }
    } catch (error) {
        console.error('Error advancing plan day:', error)
        throw error
    }
}
