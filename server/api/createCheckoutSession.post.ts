import Stripe from 'stripe';
import { ClientResponseError } from 'pocketbase';
import { useGetVerifiedUserPb } from '@/server/utils/useServerUtils';

export default defineEventHandler(async (event) => {
	const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
	const stripe = new Stripe(stripeSecretKey);
	const url = getRequestURL(event)
	
	try {
		const session = await stripe.checkout.sessions.create({
			ui_mode: 'embedded',
			line_items: [
				{
					price: 'price_1ORGsSFGPEKVU8In5NkjuRkL',
					quantity: 1,
				}
			],
			mode: 'subscription',
			return_url: `${url.origin}/payment-confirm?session_id={CHECKOUT_SESSION_ID}`,
		});

		const $pb = useGetVerifiedUserPb(event);
		if (!$pb.authStore.model?.id) throw new Error('User id not found');

		await $pb.collection('transactions').create({
			user: $pb.authStore.model.id,
			session_id: session.id,
			status: 'open',
		});

		return { clientSecret: session.client_secret };

	} catch (error) {
		if (! (error instanceof Error)) {
			throw createError({
				statusCode: 500,
				statusMessage: 'Unknown error'
			});
		}
		if (! (error instanceof ClientResponseError)) {
			throw createError({
				statusCode: 500,
			});
		}
		throw createError({
			statusCode: 500,
		});
	}
});