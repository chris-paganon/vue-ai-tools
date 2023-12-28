<template>
	<div class="flex flex-wrap gap-2 my-4">
		<NuxtLink v-if="!isSubscribed" to="/subscribe">
			<Button label="Subscribe" :loading="isSubscribeLoading" @click="isSubscribeLoading = true" />
		</NuxtLink>
		<!-- TODO: Show subscription status & period_end or cancel_at date -->
		<StripePortalButton v-else />
	</div>
</template>

<script setup lang="ts">
const { isSubscribed } = storeToRefs(useAuthStore());

const isSubscribeLoading = ref(false);
</script>