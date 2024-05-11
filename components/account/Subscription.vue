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
      <p>$10/month</p>
      <NuxtLink to="/stripe/subscribe">
        <Button
          label="Subscribe"
          :loading="isSubscribeLoading"
          @click="isSubscribeLoading = true"
        />
      </NuxtLink>
      <LemonSubscribe />
    </div>
    <!-- TODO: Add subscription price & level -->
    <div
      v-if="isSubscribed && subscriptions"
      class="flex flex-column align-items-start gap-3"
    >
      <template v-for="subscription in subscriptions" :key="subscription.id">
        <p>Status: {{ subscription.status }}</p>
        <p v-if="subscription.currentPeriodEnd">
          Next payment date:
          {{ toFormattedDate(subscription.currentPeriodEnd) }}
        </p>
        <p v-if="subscription.cancelAt">
          Cancel at: {{ toFormattedDate(subscription.cancelAt) }}
        </p>
      </template>
      <StripePortalButton />
      <LemonUpdatePayment />
      <LemonCancel />
    </div>
  </div>
</template>

<script setup lang="ts">
const { isSubscribed, subscriptions } = storeToRefs(useAuthStore());
const isSubscribeLoading = ref(false);

function toFormattedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
</script>
