import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
	try {
		const pbUser = await useGetVerifiedUserPb(event);
		if (!pbUser) throw new Error('User not found');
		const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
		const stripe = new Stripe(stripeSecretKey);
		const url = getRequestURL(event)
	
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: pbUser.stripe_id,
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