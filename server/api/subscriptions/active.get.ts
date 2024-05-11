import { eq, and, inArray } from 'drizzle-orm';
import { subscriptionsTable } from '~/db/schema/subscriptionsSchema';
import { isWithinExpirationDate } from 'oslo';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      message: 'Must be signed in to get active subscriptions',
      statusCode: 403,
    });
  }

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
});
