<template>
  <div class="my-4">
    <h2>Subscription</h2>
    <div
      v-if="!isSubscribed && user"
      class="flex flex-column align-items-start gap-3"
    >
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
      <Button class="p-0" @click.prevent>
        <a
          :href="`https://vueaitools.lemonsqueezy.com/buy/${lemonsqueezyBasicSubKey}?embed=1&checkout[email]=${user.email}&checkout[custom][user_id]=${user.id}`"
          class="lemonsqueezy-button p-3 text-0 no-underline"
          >Subscribe</a
        >
      </Button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
const lemonsqueezyBasicSubKey =
  useRuntimeConfig().public.lemonsqueezyBasicSubKey;
useHead({
  script: [
    {
      src: 'https://assets.lemonsqueezy.com/lemon.js',
      defer: true,
    },
  ],
});
interface WindowWithLemon extends Window {
  createLemonSqueezy?: () => void;
}
declare let window: WindowWithLemon;

onMounted(() => {
  let noOfRetries = 0;
  if (!window.createLemonSqueezy) {
    const intervalId = setInterval(() => {
      if (window.createLemonSqueezy) {
        window.createLemonSqueezy();
        clearInterval(intervalId);
      }
      noOfRetries++;
      if (noOfRetries > 10) {
        clearInterval(intervalId);
      }
    }, 250);
    return;
  }
  window.createLemonSqueezy();
});

const { user, isSubscribed, subscriptions } = storeToRefs(useAuthStore());
const isSubscribeLoading = ref(false);

function toFormattedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
</script>
