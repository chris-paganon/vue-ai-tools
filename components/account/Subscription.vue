<template>
  <div class="my-4">
    <h2>Subscription</h2>
    <div v-if="!isSubscribed" class="flex flex-column align-items-start gap-3">
      <p>
        There are currently no paid features, the subscription is
        <strong>just a donation</strong> for now. Your help is very much
        appreciated!
      </p>
      <p>What you get:</p>
      <ul>
        <li>Unconditional love & recognition from the dev.</li>
        <li>Street cred for helping out a fellow dev.</li>
        <li>Access to upcoming pro features.</li>
      </ul>
      <p>$5/month</p>
      <NuxtLink to="/subscribe">
        <Button
          label="Subscribe"
          :loading="isSubscribeLoading"
          @click="isSubscribeLoading = true"
        />
      </NuxtLink>
    </div>
    <!-- TODO: Add subscription price & level -->
    <div
      v-if="isSubscribed && subscription"
      class="flex flex-column align-items-start gap-3"
    >
      <p>Status: {{ subscription.status }}</p>
      <p v-if="subscription.current_period_end">
        Next payment date:
        {{ toFormattedDate(subscription.current_period_end) }}
      </p>
      <p v-if="subscription.cancel_at">
        Cancel at: {{ toFormattedDate(subscription.cancel_at) }}
      </p>
      <StripePortalButton />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();
const { isSubscribed } = storeToRefs(useAuthStore());
const isSubscribeLoading = ref(false);

const { data: subscription } = await useAsyncData('getSubscription', () =>
  $pb
    .collection('subscriptions')
    .getFirstListItem(`user="${$pb.authStore.model?.id}"`)
);

function toFormattedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
</script>
