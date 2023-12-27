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
			await updateTransactionStatus(stripeEvent);
			break;
		case 'customer.subscription.created':
			await createSubscription(stripeEvent);
			break;
		case 'customer.subscription.updated':
			await updateSubscription(stripeEvent);
			break;
		// case 'customer.subscription.deleted':
		// 	await deleteSubscription(stripe, stripeEvent);
		// 	console.log('Subscription deleted');
		// 	break;
		default:
			console.log('Stripe webhook received with unknown event type');
	}
}


async function updateTransactionStatus(stripeEvent: EnabledStripeWebhookEvents) {
	const { stripeSecretKey } = useRuntimeConfig();
	const stripe = new Stripe(stripeSecretKey);
	try {
		const adminPb = await useGetAdminPb();
	
		const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
			stripeEvent.data.object.id,
			{expand: ['line_items']}
		);
		// const lineItems = sessionWithLineItems.line_items;
		const sessionId = sessionWithLineItems.id;
	
		const transaction = await adminPb.collection('transactions').getFirstListItem(`session_id="${sessionId}"`, {
			fields: 'id',
		});
		await adminPb.collection('transactions').update(transaction.id, {
			status: sessionWithLineItems.status,
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

async function createSubscription(stripeEvent: EnabledStripeWebhookEvents) {
	if (!isSubscriptionCreatedEvent(stripeEvent)) throw new Error('Is not a subscription created event');
	const { stripeSecretKey } = useRuntimeConfig();
	const stripe = new Stripe(stripeSecretKey);

	try {
		const pb = await useGetAdminPb();
		const eventObject = stripeEvent.data.object;
		const eventObjectId = eventObject.id;

		let customer = eventObject.customer;
		if (typeof eventObject.customer === 'string') {
			customer = await stripe.customers.retrieve(eventObject.customer);
		}

		if (! isStripeCustomer(customer)) throw new Error('Is not a Stripe customer');
		const customerEmail = customer.email;
		const pbUser = await pb.collection('users').getFirstListItem(`email="${customerEmail}"`);
		
		try {
			await pb.collection('subscriptions').getFirstListItem(`stripe_id="${eventObjectId}"`,{
				fields: 'id',
			});
		} catch (error) {
			// No subscription found, so we create one.
			await pb.collection('subscriptions').create({
				stripe_id: eventObjectId,
				user: pbUser.id,
				level: 'basic',
				status: eventObject.status,
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

async function updateSubscription(stripeEvent: EnabledStripeWebhookEvents) {
	if (!isSubscriptionUpdatedEvent(stripeEvent)) throw new Error('Is not a subscription updated event');
	try {
		const pb = await useGetAdminPb();
		const eventObject = stripeEvent.data.object;
		const eventObjectId = eventObject.id;
		
		try {
			const subscription = await pb.collection('subscriptions').getFirstListItem(`stripe_id="${eventObjectId}"`,{
				fields: 'id',
			});
			await pb.collection('subscriptions').update(subscription.id, {
				status: eventObject.status,
			});
			console.log('Subscription updated');
		} catch (error) {
			// No subscription found, so we create one.
			const { stripeSecretKey } = useRuntimeConfig();
			const stripe = new Stripe(stripeSecretKey);

			let customer = eventObject.customer;
			if (typeof eventObject.customer === 'string') {
				customer = await stripe.customers.retrieve(eventObject.customer);
			}
	
			if (! isStripeCustomer(customer)) throw new Error('Is not a Stripe customer');
			const customerEmail = customer.email;
			const pbUser = await pb.collection('users').getFirstListItem(`email="${customerEmail}"`);
			
			await createOrUpdateSubscription(eventObjectId, pbUser.id, eventObject.status);
		}
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

async function createOrUpdateSubscription(stripeId: string, userId: string, subscriptionStatus: string) {
	const adminPb = await useGetAdminPb();
	try {
		const subscription = await adminPb.collection('subscriptions').getFirstListItem(`stripe_id="${stripeId}"`);
		// Subscription found, so we update it.
		await adminPb.collection('subscriptions').update(subscription.id, {
			status: subscriptionStatus,
		});
		console.log('Subscription updated in maybeCreateSubscription');
	} catch (error) {
		// No subscription found, so we create one.
		await adminPb.collection('subscriptions').create({
			stripe_id: stripeId,
			user: userId,
			level: 'basic',
			status: subscriptionStatus,
		});
		console.log('Subscription created in maybeCreateSubscription');
	}
}