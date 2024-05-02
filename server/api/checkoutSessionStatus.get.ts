import Stripe from 'stripe';
import { useGetVerifiedUserPb } from '@/server/utils/useServerUtils';
import { ClientResponseError } from 'pocketbase';
import { isStripeCustomer, isStripeDeletedCustomer } from '@/types/types';

export default defineEventHandler(async (event) => {
  const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
  const query = getQuery(event);
  const session_id = query.sessionId as string;
  if (!session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing session_id',
    });
  }
  if (!session_id.match(/^[a-zA-Z0-9_]+$/)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid session_id',
    });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const adminPb = await useGetAdminPb();

    const transaction = await adminPb
      .collection('transactions')
      .getFirstListItem(
        adminPb.filter('session_id={:session_id}', { session_id }),
        { fields: 'id' }
      );
    // TODO: Make sure not to overwrite a completed transaction
    await adminPb.collection('transactions').update(transaction.id, {
      status: session.status,
    });

    let customerId = session.customer;
    if (customerId && !isStripeDeletedCustomer(customerId)) {
      const pbUser = await useGetVerifiedUserPb(event);
      if (!pbUser) throw new Error('User id not found');
      if (isStripeCustomer(customerId)) {
        customerId = customerId.id;
      }
      await adminPb.collection('users').update(pbUser.id, {
        stripe_id: customerId,
      });
    }

    return {
      status: session.status,
      customer_email: session.customer_details?.email,
    };
  } catch (error) {
    if (!(error instanceof Error)) {
      console.log('CheckoutSessionStatus unknown error', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Unknown error',
      });
    }
    if (!(error instanceof ClientResponseError)) {
      console.log('CheckoutSessionStatus error', error);
      throw createError({
        statusCode: 500,
      });
    }
    console.log('CheckoutSessionStatus PB error', error.response);
    throw createError({
      statusCode: 500,
    });
  }
});
