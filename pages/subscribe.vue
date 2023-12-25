<template>
	<h1>Subscribe</h1>
	<div id="checkout"></div>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = useRuntimeConfig().public.stripePublishableKey;
const stripe = await loadStripe(stripePublishableKey);

const { data } = await useFetch('/api/createCheckoutSession', {
	method: 'POST',
});

watch(data,
	async () => {
		if (!data.value?.clientSecret) return;
		const checkout = await stripe?.initEmbeddedCheckout({
			clientSecret: data.value.clientSecret,
		});
		if (!checkout) return;
		checkout.mount('#checkout');
	},
	{ immediate: true }
);
</script>