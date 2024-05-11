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

const isLoading = ref(false);
async function cancelSubscription() {
  isLoading.value = true;
  try {
    await $fetch('/api/lemon/cancel');
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
