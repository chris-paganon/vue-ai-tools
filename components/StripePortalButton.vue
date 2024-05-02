<template>
  <Button
    outlined
    :loading="isPortalSessionLoading"
    @click="openPortalSession()"
    >Manage my subscription</Button
  >
</template>

<script setup lang="ts">
const isPortalSessionLoading = ref(false);

async function openPortalSession() {
  isPortalSessionLoading.value = true;
  try {
    const redirectUrl = await $fetch('/api/createPortalSession', {
      method: 'POST',
    });
    window.location.href = redirectUrl;
  } catch (error) {
    console.error(error);
  } finally {
    isPortalSessionLoading.value = false;
  }
}
</script>
