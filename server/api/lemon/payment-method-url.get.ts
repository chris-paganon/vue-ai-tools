import {
  lemonSqueezySetup,
  getSubscription,
} from '@lemonsqueezy/lemonsqueezy.js';
import { eq, and } from 'drizzle-orm';
import { subscriptionsTable } from '~/db/schema/subscriptionsSchema';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'unauthorized',
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

  if (!subscriptions || subscriptions.length === 0) {
    throw createError({
      status: 400,
      statusMessage: 'no active subscription',
    });
  }

  const subscriptionId = subscriptions[0].id;
  const lemonSqueezyApiKey = useRuntimeConfig().lemonsqueezyApiKey;
  lemonSqueezySetup({
    apiKey: lemonSqueezyApiKey,
  });
  const { statusCode, error, data } = await getSubscription(subscriptionId);
  if (error) {
    throw createError({
      status: statusCode ?? 500,
      statusMessage: error.message,
    });
  }
  if (!data?.data.attributes.urls.update_payment_method) {
    throw createError({
      status: 400,
      statusMessage: 'no portal url',
    });
  }

  return data?.data.attributes.urls.update_payment_method;
});
