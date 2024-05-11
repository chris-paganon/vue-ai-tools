<template>
  <Button outlined :loading="isLoading" @click="openPortalSession()"
    >Update my payment method</Button
  >
</template>

<script setup lang="ts">
const isLoading = ref(false);
async function openPortalSession() {
  isLoading.value = true;
  try {
    const redirectUrl = await $fetch('/api/lemon/payment-method-url');
    await navigateTo(redirectUrl, {
      external: true,
      open: {
        target: '_blank',
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
