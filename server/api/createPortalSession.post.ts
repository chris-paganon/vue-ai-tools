import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
	const checkoutSessionId = body.sessionId as string;
	if (!checkoutSessionId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing checkoutSessionId',
		});
	}

	try {
		const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
		const stripe = new Stripe(stripeSecretKey);
		const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);
		const url = getRequestURL(event)
	
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: checkoutSession.customer as string,
			return_url: `${url.origin}/account`,
		});
	
		return portalSession.url;
	} catch (error) {
		console.log('error', error);
		throw createError({
			statusCode: 500,
		});
	}
})