<template>
  <div>
    <div v-if="loading" class="fixed top-0 left-0 w-screen h-screen flex justify-content-center align-items-center surface-overlay z-5">
      <h1>loading</h1>
    </div>
    <div class="h-screen">
      <AppHeader />
      <main class="my-8 mx-auto px-5">
        <slot />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true);

onBeforeMount(() => {
  loading.value = false;
});
</script>

<style scoped>
main {
  max-width: 1024px;
}
</style>