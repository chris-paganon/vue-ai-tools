import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;
    if (!user?.stripeId) throw new Error('User id not found');
    const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
    const stripe = new Stripe(stripeSecretKey);
    const url = getRequestURL(event);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeId,
      return_url: `${url.origin}/account`,
    });

    return portalSession.url;
  } catch (error) {
    console.log('error', error);
    throw createError({
      statusCode: 500,
    });
  }
});
