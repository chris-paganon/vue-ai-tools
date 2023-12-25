import Stripe from 'stripe';

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

	let stripeEvent;
	try {
		stripeEvent = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
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

	if (stripeEvent.type === 'checkout.session.completed') {
		const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
			stripeEvent.data.object.id,
			{expand: ['line_items']}
		);
		const lineItems = sessionWithLineItems.line_items;
		console.log('lineItems', lineItems);
	}
});