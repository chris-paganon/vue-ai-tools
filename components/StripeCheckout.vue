<template>
	<p v-if="error">{{ error.statusMessage }}</p>
	<div v-else id="checkout"></div>
</template>

<script setup lang="ts">
import { loadStripe, type StripeEmbeddedCheckout} from '@stripe/stripe-js';

const stripePublishableKey = useRuntimeConfig().public.stripePublishableKey;
const stripe = await loadStripe(stripePublishableKey);

const { error, data } = await useFetch('/api/createCheckoutSession', {
	method: 'POST',
});

let checkout: StripeEmbeddedCheckout | undefined = undefined;

watch(data,
	async () => {
		if (error.value || !data.value?.clientSecret) return;
		checkout = await stripe?.initEmbeddedCheckout({
			clientSecret: data.value.clientSecret,
		});
		if (!checkout) return;
		checkout.mount('#checkout');
	},
	{ immediate: true }
);

onBeforeUnmount(() => {
	if (!checkout) return true;
	checkout.destroy();
	return true;
});
</script>