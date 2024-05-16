import {
  lemonSqueezySetup,
  getSubscription,
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
  if (!subscriptionId) {
    throw createError({
      status: 400,
      statusMessage: 'no active subscription',
    });
  }

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
