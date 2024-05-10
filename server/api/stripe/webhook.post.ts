import Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { usersTable } from '~/db/schema/usersSchema';
import {
  subscriptionsTable,
  transactionsTable,
} from '~/db/schema/subscriptionsSchema';
import {
  isEnabledStripeWebhookEvents,
  type EnabledStripeWebhookEvents,
  isStripeCustomer,
} from '@/types/types';

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  const sig = getHeader(event, 'stripe-signature');

  if (!sig || !body) {
    console.log(
      'Stripe webhook received without required signature and/or body'
    );
    throw createError({
      statusCode: 400,
      message: 'Missing data',
    });
  }

  const { stripeSecretKey, stripeWebhookSecret } = useRuntimeConfig();
  const stripe = new Stripe(stripeSecretKey);

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      stripeWebhookSecret
    );
    sendNoContent(event);

    if (isEnabledStripeWebhookEvents(stripeEvent)) {
      handleStripeWebhookEvent(stripeEvent);
    }
  } catch (err) {
    if (!(err instanceof Error)) {
      console.log('Stripe unknown error:', err);
      throw createError({
        statusCode: 400,
        message: 'Unknown webhook error',
      });
    }
    console.log('Stripe error:', err.message);
    throw createError({
      statusCode: 400,
      message: `Webhook error: ${err.message}`,
    });
  }
});

async function handleStripeWebhookEvent(
  stripeEvent: EnabledStripeWebhookEvents
) {
  console.log('Stripe webhook received with event type:', stripeEvent.type);
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
    case 'checkout.session.expired':
      await updateTransactionStatus(stripeEvent);
      break;
    case 'customer.subscription.created':
      await createSubscription(stripeEvent);
      break;
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await updateSubscription(stripeEvent);
      break;
    default:
      console.log('Stripe webhook received with unknown event type');
  }
}

async function updateTransactionStatus(
  stripeEvent:
    | Stripe.CheckoutSessionCompletedEvent
    | Stripe.CheckoutSessionExpiredEvent
) {
  const { stripeSecretKey } = useRuntimeConfig();
  const stripe = new Stripe(stripeSecretKey);
  try {
    const session = await stripe.checkout.sessions.retrieve(
      stripeEvent.data.object.id
    );
    if (session.status === null) {
      throw new Error('Session status is null');
    }

    const db = getDrizzleDb();
    await db
      .update(transactionsTable)
      .set({
        status: session.status,
      })
      .where(eq(transactionsTable.sessionId, session.id));
  } catch (error) {
    console.log('Error updating transaction status from Stripe webhook');
    if (error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log(error);
  }
}

async function createSubscription(
  stripeEvent: Stripe.CustomerSubscriptionCreatedEvent
) {
  const { stripeSecretKey } = useRuntimeConfig();
  const stripe = new Stripe(stripeSecretKey);

  try {
    const db = getDrizzleDb();
    const eventObject = stripeEvent.data.object;
    const eventObjectId = eventObject.id;

    let customer = eventObject.customer;
    if (typeof eventObject.customer === 'string') {
      customer = await stripe.customers.retrieve(eventObject.customer);
    }

    if (!isStripeCustomer(customer))
      throw new Error('Is not a Stripe customer');
    const customerEmail = customer.email;
    if (customerEmail === null) throw new Error('Customer email not found');

    const subscriptionRow = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.id, eventObjectId));
    if (subscriptionRow.length > 0) {
      console.log('Subscription already exists');
      return;
    }

    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, customerEmail));

    await db.insert(subscriptionsTable).values({
      id: eventObjectId,
      userId: dbUser[0].id,
      level: 'basic',
      status: eventObject.status,
      currentPeriodEnd: timestampToUTCDate(eventObject.current_period_end),
      cancelAt: eventObject.cancel_at
        ? timestampToUTCDate(eventObject.cancel_at)
        : null,
    });
    console.log('Subscription created in createSubscription');
    // TODO: Check if pbUser has stripe_id matching the Stripe customer id. If not, add the stripe_id to the user (one email can have mutliple ids in Stripe).
  } catch (error) {
    if (!(error instanceof Error)) {
      console.log('Error creating subscription from Stripe webhook', error);
      return;
    }
    console.log(
      'Error creating subscription from Stripe webhook',
      error.message
    );
    return;
  }
}

async function updateSubscription(
  stripeEvent:
    | Stripe.CustomerSubscriptionUpdatedEvent
    | Stripe.CustomerSubscriptionDeletedEvent
) {
  const { stripeSecretKey } = useRuntimeConfig();
  const stripe = new Stripe(stripeSecretKey);

  try {
    const eventObject = stripeEvent.data.object;
    const eventObjectId = eventObject.id;

    let customer = eventObject.customer;
    if (typeof eventObject.customer === 'string') {
      customer = await stripe.customers.retrieve(eventObject.customer);
    }

    if (!isStripeCustomer(customer))
      throw new Error('Is not a Stripe customer');
    const customerEmail = customer.email;
    if (customerEmail === null) throw new Error('Customer email not found');

    const db = getDrizzleDb();
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, customerEmail));

    await createOrUpdateSubscription(eventObjectId, dbUser[0].id, eventObject);
  } catch (error) {
    if (!(error instanceof Error)) {
      console.log('Error updating subscription from Stripe webhook', error);
      return;
    }
    console.log(
      'Error updating subscription from Stripe webhook',
      error.message
    );
    return;
  }
}

async function createOrUpdateSubscription(
  stripeId: string,
  userId: string,
  subscriptionObject: Stripe.Subscription
) {
  const db = getDrizzleDb();
  await db
    .insert(subscriptionsTable)
    .values({
      id: stripeId,
      userId,
      level: 'basic',
      status: subscriptionObject.status,
      currentPeriodEnd: timestampToUTCDate(
        subscriptionObject.current_period_end
      ),
      cancelAt: subscriptionObject.cancel_at
        ? timestampToUTCDate(subscriptionObject.cancel_at)
        : null,
    })
    .onConflictDoUpdate({
      target: subscriptionsTable.id,
      set: {
        status: subscriptionObject.status,
        currentPeriodEnd: timestampToUTCDate(
          subscriptionObject.current_period_end
        ),
        cancelAt: subscriptionObject.cancel_at
          ? timestampToUTCDate(subscriptionObject.cancel_at)
          : null,
      },
    });
  console.log('Subscription created or updated in createOrUpdateSubscription');
}

function timestampToUTCDate(timestamp: number) {
  const time = new Date(timestamp * 1000).toISOString();
  return time;
}
