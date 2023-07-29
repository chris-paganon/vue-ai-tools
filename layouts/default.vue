<template>
  <div>
    <div v-if="loading">
      <h1>loading</h1>
    </div>
    <div v-else>
      <AppHeader />
      <slot />
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('Layout setup');
const loading = ref(true);

onMounted(() => {
  console.log('Layout mounted');
  loading.value = false;
});
</script>