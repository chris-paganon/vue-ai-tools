import Stripe from 'stripe';
import { transactionsTable } from '~/db/schema/subscriptionsSchema';

export default defineEventHandler(async (event) => {
  const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
  const stripe = new Stripe(stripeSecretKey);
  const url = getRequestURL(event);

  try {
    const user = event.context.user;
    if (!user) throw new Error('User id not found');

    const createSessionObj: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      line_items: [
        {
          price: 'price_1ORGsSFGPEKVU8In5NkjuRkL',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: `${url.origin}/payment-confirm?session_id={CHECKOUT_SESSION_ID}`,
    };
    if (user.stripeId) {
      createSessionObj.customer = user.stripeId;
    } else {
      createSessionObj.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(createSessionObj);

    const db = getDrizzleDb();
    await db.insert(transactionsTable).values({
      userId: user.id,
      sessionId: session.id,
      status: 'open',
    });

    return { clientSecret: session.client_secret };
  } catch (error) {
    console.log('Unknown error createCheckoutSession', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown error',
    });
  }
});
