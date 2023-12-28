import Stripe from 'stripe';
import { ClientResponseError } from 'pocketbase';
import { useGetAdminPb } from '@/server/utils/useServerUtils';
import { isEnabledStripeWebhookEvents, type EnabledStripeWebhookEvents, isSubscriptionUpdatedEvent, isSubscriptionCreatedEvent, isStripeCustomer } from '@/types/types';

export default defineEventHandler(async (event) => {
	const body = await readRawBody(event);
	const sig = getHeader(event, 'stripe-signature');

	if (!sig || !body) {
		console.log('Stripe webhook received without required signature and/or body');
		throw createError({
			statusCode: 400,
			message: 'Missing data'
		});
	}
	
	const { stripeSecretKey, stripeWebhookSecret } = useRuntimeConfig();
	const stripe = new Stripe(stripeSecretKey);

	try {
		const stripeEvent = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
		sendNoContent(event);

		if (isEnabledStripeWebhookEvents(stripeEvent)) {
			handleStripeWebhookEvent(stripeEvent);
		}
  } catch (err) {
		if ( !(err instanceof Error) ) {
			console.log('Stripe unknown error:', err);
			throw createError({
				statusCode: 400,
				message: 'Unknown webhook error'
			});
		}
			console.log('Stripe error:', err.message);
			throw createError({
			statusCode: 400,
			message: `Webhook error: ${err.message}`
		});
  }
});

async function handleStripeWebhookEvent(stripeEvent: EnabledStripeWebhookEvents) {
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

async function updateTransactionStatus(stripeEvent: Stripe.CheckoutSessionCompletedEvent | Stripe.CheckoutSessionExpiredEvent) {
	const { stripeSecretKey } = useRuntimeConfig();
	const stripe = new Stripe(stripeSecretKey);
	try {
		const adminPb = await useGetAdminPb();
		const session = await stripe.checkout.sessions.retrieve(stripeEvent.data.object.id);

		const transaction = await adminPb.collection('transactions').getFirstListItem(`session_id="${session.id}"`, {
			fields: 'id',
		});
		await adminPb.collection('transactions').update(transaction.id, {
			status: session.status,
		});
	} catch (error) {
		console.log('Error updating transaction status from Stripe webhook');
		if ( error instanceof Error ) {
			console.log(error.message);
		} else {
			console.log(error);
		}
	}
}

async function createSubscription(stripeEvent: Stripe.CustomerSubscriptionCreatedEvent) {
	const { stripeSecretKey } = useRuntimeConfig();
	const stripe = new Stripe(stripeSecretKey);

	try {
		const adminPb = await useGetAdminPb();
		const eventObject = stripeEvent.data.object;
		const eventObjectId = eventObject.id;

		let customer = eventObject.customer;
		if (typeof eventObject.customer === 'string') {
			customer = await stripe.customers.retrieve(eventObject.customer);
		}

		if (! isStripeCustomer(customer)) throw new Error('Is not a Stripe customer');
		const customerEmail = customer.email;
		const pbUser = await adminPb.collection('users').getFirstListItem(`email="${customerEmail}"`);
		// TODO: Check if pbUser has stripe_id matching the Stripe customer id. If not, add the stripe_id to the user (one email can have mutliple ids in Stripe).

		try {
			// If a subscription already exists, we do nothing. This returns an error if no subscription is found.
			await adminPb.collection('subscriptions').getFirstListItem(`stripe_id="${eventObjectId}"`,{
				fields: 'id',
			});
		} catch (error) {
			// No subscription found, so we create one.
			await adminPb.collection('subscriptions').create({
				stripe_id: eventObjectId,
				user: pbUser.id,
				level: 'basic',
				status: eventObject.status,
				current_period_end: timestampToUTCDate(eventObject.current_period_end),
				cancel_at: eventObject.cancel_at ? timestampToUTCDate(eventObject.cancel_at) : null,
			});
			console.log('Subscription created in createSubscription');
		}
	} catch (error) {
		if ( !(error instanceof Error) ) {
			console.log('Error creating subscription from Stripe webhook', error);
			return;
		}
		if ( ! (error instanceof ClientResponseError) ) {
			console.log('Error creating subscription from Stripe webhook', error.message);
			return;
		}
		console.log('Error creating subscription from Stripe webhook', error.response);
		return;
	}
}

async function updateSubscription(stripeEvent: Stripe.CustomerSubscriptionUpdatedEvent | Stripe.CustomerSubscriptionDeletedEvent) {
	const { stripeSecretKey } = useRuntimeConfig();
	const stripe = new Stripe(stripeSecretKey);
	
	try {
		const adminPb = await useGetAdminPb();
		const eventObject = stripeEvent.data.object;
		const eventObjectId = eventObject.id;

		let customer = eventObject.customer;
		if (typeof eventObject.customer === 'string') {
			customer = await stripe.customers.retrieve(eventObject.customer);
		}

		if (! isStripeCustomer(customer)) throw new Error('Is not a Stripe customer');
		const customerEmail = customer.email;
		const pbUser = await adminPb.collection('users').getFirstListItem(`email="${customerEmail}"`);
		
		await createOrUpdateSubscription(eventObjectId, pbUser.id, eventObject);
	} catch (error) {
		if ( !(error instanceof Error) ) {
			console.log('Error updating subscription from Stripe webhook', error);
			return;
		}
		if ( ! (error instanceof ClientResponseError) ) {
			console.log('Error updating subscription from Stripe webhook', error.message);
			return;
		}
		console.log('Error updating subscription from Stripe webhook', error.response);
		return;
	}
}

async function createOrUpdateSubscription(stripeId: string, userId: string, subscriptionObject: Stripe.Subscription) {
	const adminPb = await useGetAdminPb();
	try {
		const subscription = await adminPb.collection('subscriptions').getFirstListItem(`stripe_id="${stripeId}"`);
		// Subscription found, so we update it.
		await adminPb.collection('subscriptions').update(subscription.id, {
			status: subscriptionObject.status,
			current_period_end: timestampToUTCDate(subscriptionObject.current_period_end),
			cancel_at: subscriptionObject.cancel_at ? timestampToUTCDate(subscriptionObject.cancel_at) : null,
		});
		console.log('Subscription updated in createOrUpdateSubscription');
	} catch (error) {
		// No subscription found, so we create one.
		await adminPb.collection('subscriptions').create({
			stripe_id: stripeId,
			user: userId,
			level: 'basic',
			status: subscriptionObject.status,
			current_period_end: timestampToUTCDate(subscriptionObject.current_period_end),
			cancel_at: subscriptionObject.cancel_at ? timestampToUTCDate(subscriptionObject.cancel_at) : null,
		});
		console.log('Subscription created in createOrUpdateSubscription');
	}
}

function timestampToUTCDate(timestamp: number) {
	const time = new Date(timestamp * 1000).toISOString();
	return time;
}