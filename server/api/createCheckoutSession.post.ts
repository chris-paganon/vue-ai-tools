import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
	const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
	const stripe = new Stripe(stripeSecretKey);

	const session = await stripe.checkout.sessions.create({
		ui_mode: 'embedded',
		line_items: [
			{
				price: 'price_1ORGsSFGPEKVU8In5NkjuRkL',
				quantity: 1,
			}
		],
		mode: 'subscription',
		return_url: 'http://localhost:3000/payment-confirm?session_id={CHECKOUT_SESSION_ID}',
	});

	return { clientSecret: session.client_secret };
});