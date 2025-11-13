import { prisma } from './prisma';
import { User, Subscription, Purchase } from '@prisma/client';

/**
 * Check if user has an active subscription to a specific tier
 */
export async function isUserSubscribedToTier(
  userId: string,
  tierKey: string
): Promise<boolean> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        tierKey,
        status: {
          in: ['active', 'trialing'],
        },
      },
    });

    return !!subscription;
  } catch (error) {
    console.error(`Error checking subscription for user ${userId}:`, error);
    return false;
  }
}

/**
 * Check if user has any active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing'],
        },
      },
    });

    return !!subscription;
  } catch (error) {
    console.error(`Error checking active subscription for user ${userId}:`, error);
    return false;
  }
}

/**
 * Check if user has purchased a specific variant (size)
 */
export async function hasUserPurchasedVariant(
  userId: string,
  sizeKey: string
): Promise<boolean> {
  try {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        sizeKey,
        status: 'succeeded',
      },
    });

    return !!purchase;
  } catch (error) {
    console.error(`Error checking variant purchase for user ${userId}:`, error);
    return false;
  }
}

/**
 * Check if user has made a one-time purchase with a specific Stripe Price ID
 */
export async function hasOneTimePurchase(
  userId: string,
  stripePriceId: string
): Promise<boolean> {
  try {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        stripePriceId,
        status: 'succeeded',
      },
    });

    return !!purchase;
  } catch (error) {
    console.error(`Error checking one-time purchase for user ${userId}:`, error);
    return false;
  }
}

/**
 * Get all active subscriptions for a user
 */
export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  try {
    return await prisma.subscription.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error(`Error fetching subscriptions for user ${userId}:`, error);
    return [];
  }
}

/**
 * Get all purchases for a user
 */
export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  try {
    return await prisma.purchase.findMany({
      where: {
        userId,
        status: 'succeeded',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error(`Error fetching purchases for user ${userId}:`, error);
    return [];
  }
}

/**
 * Get user's active subscription (if any)
 */
export async function getActiveSubscription(
  userId: string
): Promise<Subscription | null> {
  try {
    return await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error(`Error fetching active subscription for user ${userId}:`, error);
    return null;
  }
}

/**
 * Check if subscription is about to expire (within 7 days)
 */
export async function isSubscriptionExpiringSoon(userId: string): Promise<boolean> {
  try {
    const subscription = await getActiveSubscription(userId);

    if (!subscription || !subscription.currentPeriodEnd) {
      return false;
    }

    const daysUntilExpiry = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  } catch (error) {
    console.error(`Error checking subscription expiry for user ${userId}:`, error);
    return false;
  }
}

/**
 * Get subscription by Stripe Subscription ID
 */
export async function getSubscriptionByStripeId(
  stripeSubscriptionId: string
): Promise<Subscription | null> {
  try {
    return await prisma.subscription.findUnique({
      where: {
        stripeSubscriptionId,
      },
    });
  } catch (error) {
    console.error(`Error fetching subscription ${stripeSubscriptionId}:`, error);
    return null;
  }
}

/**
 * Upsert subscription from Stripe webhook data
 */
export async function upsertSubscription(data: {
  userId?: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeProductId: string;
  tierKey?: string;
  sizeKey?: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date;
}): Promise<Subscription> {
  // Try to find existing subscription
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: data.stripeSubscriptionId },
  });

  // If updating and no userId provided, use existing userId
  const finalUserId = data.userId || existing?.userId;

  if (!finalUserId) {
    // Try to find user by Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: data.stripeCustomerId },
    });

    if (!user) {
      throw new Error(
        `Cannot create subscription: no user found for customer ${data.stripeCustomerId}`
      );
    }

    data.userId = user.id;
  }

  return await prisma.subscription.upsert({
    where: { stripeSubscriptionId: data.stripeSubscriptionId },
    create: {
      userId: data.userId!,
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      stripePriceId: data.stripePriceId,
      stripeProductId: data.stripeProductId,
      tierKey: data.tierKey,
      sizeKey: data.sizeKey,
      status: data.status,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      canceledAt: data.canceledAt,
    },
    update: {
      stripePriceId: data.stripePriceId,
      stripeProductId: data.stripeProductId,
      tierKey: data.tierKey,
      sizeKey: data.sizeKey,
      status: data.status,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      canceledAt: data.canceledAt,
    },
  });
}

/**
 * Create a purchase record
 */
export async function createPurchase(data: {
  userId: string;
  stripePriceId: string;
  stripeProductId: string;
  sizeKey?: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
}): Promise<Purchase> {
  return await prisma.purchase.create({
    data,
  });
}

/**
 * Update purchase status
 */
export async function updatePurchaseStatus(
  stripePaymentIntentId: string,
  status: string
): Promise<Purchase | null> {
  try {
    return await prisma.purchase.update({
      where: { stripePaymentIntentId },
      data: { status },
    });
  } catch (error) {
    console.error(`Error updating purchase ${stripePaymentIntentId}:`, error);
    return null;
  }
}
