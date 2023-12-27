import Stripe from 'stripe';
import { useGetVerifiedUserPb } from '@/server/utils/useServerUtils';
import { ClientResponseError } from 'pocketbase';

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
	
		const pbUser = await useGetVerifiedUserPb(event);
		const adminPb = await useGetAdminPb();
		if (!pbUser) throw new Error('User id not found');
	
		const transaction = await adminPb.collection('transactions').getFirstListItem(`user="${pbUser.id}"`, {
			fields: 'id',
		});
		// TODO: Make sure not to overwrite a completed transaction
		await adminPb.collection('transactions').update(transaction.id, {
			status: session.status,
		});
	
		return {
			status: session.status,
			customer_email: session.customer_details?.email,
		};
	} catch (error) {
		if (! (error instanceof Error)) {
			console.log("CheckoutSessionStatus unknown error", error);
			throw createError({
				statusCode: 500,
				statusMessage: 'Unknown error'
			});
		}
		if (! (error instanceof ClientResponseError)) {
			console.log("CheckoutSessionStatus error", error);
			throw createError({
				statusCode: 500,
			});
		}
		console.log("CheckoutSessionStatus PB error", error.response);
		throw createError({
			statusCode: 500,
		});
	}
});