import type { User } from 'lucia';
import { eq, and, inArray } from 'drizzle-orm';
import { isWithinExpirationDate } from 'oslo';
import { subscriptionsTable } from '~/db/schema/subscriptionsSchema';

export async function useGetActiveSubscriptionId(user: User) {
  const db = getDrizzleDb();
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, user.id),
        eq(subscriptionsTable.status, 'active')
      )
    );

  if (!subscriptions || subscriptions.length === 0) {
    return false;
  }

  return subscriptions[0].id;
}

export async function useGetStillActiveSubscriptions(user: User) {
  const db = getDrizzleDb();
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, user.id),
        inArray(subscriptionsTable.status, ['active', 'cancelled'])
      )
    );

  if (!subscriptions || subscriptions.length === 0) {
    return [];
  }

  const hasActiveSubscription = subscriptions.some(
    (subscription) => subscription.status === 'active'
  );
  if (hasActiveSubscription) {
    return subscriptions;
  }

  const hasCancelledActiveSubscription = subscriptions.some((subscription) => {
    const isCancelled = subscription.status === 'cancelled';
    const isCancelledActive = subscription.cancelAt
      ? isWithinExpirationDate(new Date(subscription.cancelAt))
      : false;
    return isCancelled && isCancelledActive;
  });
  if (!hasCancelledActiveSubscription) {
    return [];
  }

  return subscriptions;
}

export async function useIsSubscribed(user: User) {
  const subscriptions = await useGetStillActiveSubscriptions(user);
  return subscriptions.length > 0;
}
