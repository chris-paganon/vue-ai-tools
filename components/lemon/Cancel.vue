<template>
  <Button outlined :loading="isLoading" @click="cancelSubscription()"
    >Cancel my subscription</Button
  >
</template>

<script setup lang="ts">
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
