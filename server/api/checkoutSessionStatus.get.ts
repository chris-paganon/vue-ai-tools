import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
	const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
	const query = getQuery(event);
	const session_id = query.sessionId as string;
	if (!session_id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing session_id'
		});
	}

	const stripe = new Stripe(stripeSecretKey);
	const session = await stripe.checkout.sessions.retrieve(session_id);

	return {
		status: session.status,
		customer_email: session.customer_details?.email,
	};
});