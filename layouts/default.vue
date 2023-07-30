<template>
  <div class="p-input-filled">
    <div v-if="appLoading" class="fixed top-0 left-0 w-screen h-screen flex justify-content-center align-items-center surface-overlay z-5">
      <h1>loading</h1>
    </div>
    <div class="h-screen">
      <AppHeader />
      <slot />
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const appLoading = ref(true);
onMounted(() => {
  appLoading.value = false;
});
</script>