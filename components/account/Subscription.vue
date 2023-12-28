<template>
	<div class="flex flex-wrap gap-2 my-4">
		<!-- TODO: Show subscription status & period_end or cancel_at date. Do not show subscribe if already subscribed. -->
		<NuxtLink to="/subscribe">
			<Button label="Subscribe" :loading="isSubscribeLoading" @click="isSubscribeLoading = true" />
		</NuxtLink>
		<!-- TODO: Only show if user has subscription -->
		<StripePortalButton />
	</div>
</template>

<script setup lang="ts">
const isSubscribeLoading = ref(false);
</script>