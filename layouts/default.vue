<template>
  <div>
    <div v-if="loading" class="fixed top-0 left-0 w-screen h-screen flex justify-content-center align-items-center surface-overlay z-5">
      <h1>loading</h1>
    </div>
    <div>
      <AppHeader />
      <slot />
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('Layout setup');
const loading = ref(true);

onBeforeMount(() => {
  console.log('Layout mounted');
  loading.value = false;
});
</script>