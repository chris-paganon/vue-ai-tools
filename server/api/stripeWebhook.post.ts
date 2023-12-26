import Stripe from 'stripe';
import { useGetAdminPb } from '@/server/utils/useServerUtils';

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
		const stripeEvent = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret) as Stripe.CheckoutSessionCompletedEvent;
		sendNoContent(event);

		if (stripeEvent.type === 'checkout.session.completed' || stripeEvent.type === 'checkout.session.expired') {
			updateTransactionStatus(stripe, stripeEvent);
		}
  } catch (err) {
		if ( !(err instanceof Error) ) {
			throw createError({
				statusCode: 400,
				message: 'Unknown webhook error'
			});
		}
		throw createError({
			statusCode: 400,
			message: `Webhook error: ${err.message}`
		});
  }
});

async function updateTransactionStatus(stripe: Stripe, stripeEvent: Stripe.CheckoutSessionCompletedEvent) {
	try {
		const pb = await useGetAdminPb();
	
		const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
			stripeEvent.data.object.id,
			{expand: ['line_items']}
		);
		// const lineItems = sessionWithLineItems.line_items;
		const sessionId = sessionWithLineItems.id;
	
		const transaction = await pb.collection('transactions').getFirstListItem(`session_id="${sessionId}"`, {
			fields: 'id',
		});
		await pb.collection('transactions').update(transaction.id, {
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