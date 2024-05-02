import Stripe from 'stripe';
import { ClientResponseError } from 'pocketbase';
import { useGetVerifiedUserPb } from '@/server/utils/useServerUtils';

export default defineEventHandler(async (event) => {
  const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
  const stripe = new Stripe(stripeSecretKey);
  const url = getRequestURL(event);

  try {
    const pbUser = await useGetVerifiedUserPb(event);
    if (!pbUser) throw new Error('User id not found');

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
    if (pbUser.stripe_id) {
      createSessionObj.customer = pbUser.stripe_id;
    } else {
      createSessionObj.customer_email = pbUser.email;
    }

    const session = await stripe.checkout.sessions.create(createSessionObj);

    const adminPb = await useGetAdminPb();
    await adminPb.collection('transactions').create({
      user: pbUser.id,
      session_id: session.id,
      status: 'open',
    });

    return { clientSecret: session.client_secret };
  } catch (error) {
    if (!(error instanceof Error)) {
      console.log('Unknown error createCheckoutSession', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Unknown error',
      });
    }
    if (!(error instanceof ClientResponseError)) {
      console.log('Error createCheckoutSession', error);
      throw createError({
        statusCode: 500,
      });
    }
    console.log('PB error createCheckoutSession', error.response);
    throw createError({
      statusCode: 500,
    });
  }
});
