import Stripe from 'stripe';
import { useGetVerifiedUserPb } from '@/server/utils/useServerUtils';

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

	try {
		const session = await stripe.checkout.sessions.retrieve(session_id);
	
		const $pb = useGetVerifiedUserPb(event);
		if (!$pb.authStore.model?.id) throw new Error('User id not found');
	
		const transaction = await $pb.collection('transactions').getFirstListItem(`session_id="${session.id}"`, {
			fields: 'id',
		});
		// TODO: Make sure not to overwrite a completed transaction
		await $pb.collection('transactions').update(transaction.id, {
			status: session.status,
		});
	
		return {
			status: session.status,
			customer_email: session.customer_details?.email,
		};
	} catch (error) {
		if (! (error instanceof Error)) {
			throw createError({
				statusCode: 500,
				statusMessage: 'Unknown error'
			});
		}
		throw createError({
			statusCode: 500,
		});
	}
});