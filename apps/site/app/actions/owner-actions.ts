'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client'

// STRICT ACCESS CONTROL
const OWNER_EMAIL = 'azer.kasim@icloud.com'

async function checkOwnerAccess() {
  const session = await auth()
  if (!session || !('user' in session) || !session.user?.email || session.user.email !== OWNER_EMAIL) {
    throw new Error('Unauthorized: Only the owner can perform this action.')
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  await checkOwnerAccess()
  
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })
    revalidatePath('/admin/owner')
    return { success: true, message: `User role updated to ${newRole}` }
  } catch (error) {
    return { success: false, message: 'Failed to update role' }
  }
}

export async function updateUserSubscription(userId: string, plan: SubscriptionPlan, status: SubscriptionStatus) {
  await checkOwnerAccess()
  
  try {
    // Check if subscription exists
    const existingSub = await prisma.subscription.findFirst({
      where: { userId },
    })

    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: { 
          plan, 
          status,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Extend by 30 days automatically
        },
      })
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          plan,
          status,
          stripeCustomerId: `manual_${userId}`, // Placeholder
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    }
    
    revalidatePath('/admin/owner')
    return { success: true, message: `Subscription updated to ${plan} (${status})` }
  } catch (error) {
    return { success: false, message: 'Failed to update subscription' }
  }
}

export async function banUser(userId: string) {
  await checkOwnerAccess()
  
  try {
    // We can use the 'suspended' enrollment status or create a specific ban mechanism.
    // For now, let's revoke all access by setting role to student and cancelling subscription.
    
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: 'student' }, // Reset role
      }),
      prisma.subscription.updateMany({
        where: { userId },
        data: { status: 'cancelled' },
      }),
      prisma.enrollment.updateMany({
        where: { userId },
        data: { status: 'suspended' },
      })
    ])

    revalidatePath('/admin/owner')
    return { success: true, message: 'User has been banned (Role reset, Subs cancelled, Enrollments suspended)' }
  } catch (error) {
    return { success: false, message: 'Failed to ban user' }
  }
}

export async function deleteUser(userId: string) {
  await checkOwnerAccess()
  
  try {
    await prisma.user.delete({
      where: { id: userId },
    })
    revalidatePath('/admin/owner')
    return { success: true, message: 'User permanently deleted' }
  } catch (error) {
    return { success: false, message: 'Failed to delete user' }
  }
}

