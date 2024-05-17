<template>
  <Button outlined :loading="isLoading" @click="confirmCancel"
    >Cancel my subscription</Button
  >
</template>

<script setup lang="ts">
const { setSubscriptionStatus } = useAuthStore();
const confirm = useConfirm();

function confirmCancel() {
  confirm.require({
    message: 'Are you sure you want to cancel your subscription?',
    header: 'Cancel Subscription',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes, cancel it',
    rejectLabel: 'No, keep it',
    accept: cancelSubscription,
  });
}

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
