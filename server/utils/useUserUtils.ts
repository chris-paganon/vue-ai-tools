import type { User } from 'lucia';
import { eq, and } from 'drizzle-orm';
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
