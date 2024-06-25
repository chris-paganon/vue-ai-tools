<template>
  <div class="my-4">
    <h2>Subscription</h2>
    <div v-if="!isSubscribed" class="flex flex-column align-items-start gap-3">
      <p>
        <strong
          >Subscribe to get futur access to Deepseek Coder 128k token context
          length (currently limited to 32k).</strong
        >
      </p>
      <ul>
        <li>More accurate answers</li>
        <li>Unlimited requests</li>
        <li>Access to future paid features</li>
      </ul>
      <p>$10/month</p>
      <LemonSubscribe />
    </div>
    <!-- TODO: Add subscription price & level -->
    <div
      v-if="isSubscribed && subscriptions"
      class="flex flex-column align-items-start gap-3"
    >
      <p>
        <strong>
          Thank you for your subscription! All your requests are now
          automatically using Command R+.
        </strong>
      </p>
      <template
        v-for="(subscription, index) in subscriptions"
        :key="subscription.id"
      >
        <Divider v-if="index !== 0" />
        <p>
          <strong>#{{ subscription.id }}</strong>
        </p>
        <p>Status: {{ subscription.status }}</p>
        <p v-if="subscription.currentPeriodEnd && !subscription.cancelAt">
          Next payment date:
          {{ toFormattedDate(subscription.currentPeriodEnd) }}
        </p>
        <p v-if="subscription.cancelAt">
          Cancelling on: {{ toFormattedDate(subscription.cancelAt) }}
        </p>
      </template>
      <div class="flex flex-column align-items-start gap-3 mt-3">
        <LemonUpdatePayment />
        <LemonCancel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isSubscribed, subscriptions } = storeToRefs(useAuthStore());

function toFormattedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
</script>
