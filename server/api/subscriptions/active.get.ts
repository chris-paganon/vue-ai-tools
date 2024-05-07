import { eq, and } from 'drizzle-orm';
import { subscriptionsTable } from '~/db/schema/subscriptionsSchema';

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
        eq(subscriptionsTable.status, 'active')
      )
    );

  return subscriptions;
});
