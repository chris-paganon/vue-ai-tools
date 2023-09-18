<template>
  <div class="p-input-filled">
    <AppLoader />
    <ChatDialog />
    <div class="min-h-screen flex flex-column">
      <AppHeader />
      <slot />
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  script: [
    {
      async: true,
      src: 'http://159.203.58.85:3000/script.js',
      'data-website-id': '716766be-9975-4463-be2d-2a8b39c8d4cb',
    }
  ],
});
</script>