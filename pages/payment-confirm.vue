<template>
  <!-- TODO: Show better messages -->
  <div>
    <h1>Thank you!</h1>
    <div
      v-if="status === 'complete'"
      class="flex flex-column align-items-start gap-3 mb-4"
    >
      <p>Your transaction was completed, you are now subscribed.</p>
      <p>Go to your account to see more details:</p>
      <NuxtLink to="/account">
        <Button
          outlined
          icon="pi pi-user"
          label="My account"
          aria-label="User"
        />
      </NuxtLink>
      <p class="mt-3">Or manage your subscription here:</p>
      <StripePortalButton />
    </div>
    <div v-else class="flex flex-column align-items-start gap-3 mb-4">
      <p>
        We haven't received the completed transaction yet. Check your account in
        the next few minutes to check if we have received the payment:
      </p>
      <NuxtLink to="/account">
        <Button
          outlined
          icon="pi pi-user"
          label="My account"
          aria-label="User"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Stripe from 'stripe';

const url = useRequestURL();
const urlParams = new URLSearchParams(url.search);
const sessionId = urlParams.get('session_id');

const status = ref<Stripe.Checkout.Session.Status>('open');

if (!sessionId) {
  throw new Error('No session_id found in URL params');
}

const { data } = await useFetch('/api/checkoutSessionStatus', {
  method: 'GET',
  query: {
    sessionId,
  },
});

watch(
  data,
  async () => {
    // TODO: Handle error
    if (!data.value?.status) return;
    status.value = data.value.status;
  },
  { immediate: true }
);
</script>
