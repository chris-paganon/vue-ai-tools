<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
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