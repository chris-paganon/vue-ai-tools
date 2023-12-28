<template>
	<div class="my-4">
		<h2>Subscription</h2>
		<NuxtLink v-if="!isSubscribed" to="/subscribe">
			<Button label="Subscribe" :loading="isSubscribeLoading" @click="isSubscribeLoading = true" />
		</NuxtLink>
		<!-- TODO: Add subscription price & level -->
		<div v-if="isSubscribed && subscription" class="flex flex-column align-items-start gap-3">
			<p>Status: {{ subscription.status }}</p>
			<p v-if="subscription.current_period_end">Next payment date: {{ toFormattedDate(subscription.current_period_end) }}</p>
			<p v-if="subscription.cancel_at">Cancel at: {{ toFormattedDate(subscription.cancel_at) }}</p>
			<StripePortalButton />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PbSubscription } from '@/types/types';

const { $pb } = useNuxtApp();
const { isSubscribed } = storeToRefs(useAuthStore());
const isSubscribeLoading = ref(false);

const { data: subscription } = await useAsyncData(
	'getSubscription',
	() => $pb.collection('subscriptions').getFirstListItem<PbSubscription>(`user="${$pb.authStore.model?.id}"`)
);

function toFormattedDate(date: string) {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	});
}
</script>