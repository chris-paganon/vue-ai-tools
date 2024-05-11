import {
  lemonSqueezySetup,
  cancelSubscription,
} from '@lemonsqueezy/lemonsqueezy.js';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'unauthorized',
    });
  }

  const subscriptionId = await useGetActiveSubscriptionId(user);

  const lemonSqueezyApiKey = useRuntimeConfig().lemonsqueezyApiKey;
  lemonSqueezySetup({
    apiKey: lemonSqueezyApiKey,
  });
  const { statusCode, error } = await cancelSubscription(subscriptionId);
  if (error) {
    throw createError({
      status: statusCode ?? 500,
      statusMessage: error.message,
    });
  }

  return { success: true };
});
