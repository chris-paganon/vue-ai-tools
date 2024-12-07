<template>
  <main
    class="flex-grow-1 flex flex-column align-items-center justify-content-center"
  >
    <h1>404, this page doesn't exist</h1>
    <Button
      @click="$router.push('/')"
      label="Go back to the home page"
      class="w-fit"
    />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home',
});
</script>
