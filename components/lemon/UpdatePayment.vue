<template>
  <Button outlined :loading="isLemonPortalLoading" @click="openPortalSession()"
    >Update my payment method</Button
  >
</template>

<script setup lang="ts">
const isLemonPortalLoading = ref(false);
async function openPortalSession() {
  isLemonPortalLoading.value = true;
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
    isLemonPortalLoading.value = false;
  }
}
</script>
