import Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/db/schema/usersSchema';
import { transactionsTable } from '@/db/schema/subscriptionsSchema';
import { isStripeCustomer, isStripeDeletedCustomer } from '@/types/types';

export default defineEventHandler(async (event) => {
  const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
  const query = getQuery(event);
  const sessionId = query.sessionId as string;
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing sessionId',
    });
  }
  if (!sessionId.match(/^[a-zA-Z0-9_]+$/)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid sessionId',
    });
  }

  const stripe = new Stripe(stripeSecretKey);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status === null) {
      throw new Error('Session status is null');
    }

    const db = getDrizzleDb();
    // TODO: Make sure not to overwrite a completed transaction
    await db
      .update(transactionsTable)
      .set({
        status: session.status,
      })
      .where(eq(transactionsTable.sessionId, sessionId));

    let customerId = session.customer;
    if (customerId && !isStripeDeletedCustomer(customerId)) {
      const user = event.context.user;
      if (!user) throw new Error('User id not found');
      if (isStripeCustomer(customerId)) {
        customerId = customerId.id;
      }
      await db
        .update(usersTable)
        .set({ stripeId: customerId })
        .where(eq(usersTable.id, user.id));
    }

    return {
      status: session.status,
      customer_email: session.customer_details?.email,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log('CheckoutSessionStatus error', error.message);
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      });
    }
    console.log('CheckoutSessionStatus unknown error', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown error',
    });
  }
});
