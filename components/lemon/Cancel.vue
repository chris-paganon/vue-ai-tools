<template>
  <Button outlined :loading="isLoading" @click="isConfirmationOpened = true"
    >Cancel my subscription</Button
  >
  <ConfirmDialog
    v-model="isConfirmationOpened"
    title="Cancel Subscription"
    message="Are you sure you want to cancel your subscription?"
    confirm-label="Yes, cancel"
    cancel-label="No, keep it"
    @confirmed="cancelSubscription"
  />
</template>

<script setup lang="ts">
const isConfirmationOpened = ref(false);
const { setSubscriptionStatus } = useAuthStore();

const isLoading = ref(false);
async function cancelSubscription() {
  isLoading.value = true;
  try {
    await $fetch('/api/lemon/cancel');
    await waitSetSubscriptionStatus();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

async function waitSetSubscriptionStatus() {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await setSubscriptionStatus();
      resolve(true);
    }, 2000);
  });
}
</script>
