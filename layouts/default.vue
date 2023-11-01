<template>
  <div class="p-input-filled">
    <Toast />
    <ChatDialog />
    <AppLogin />
    <AppSignUp />
    <div class="min-h-screen flex flex-column">
      <AppHeader />
      <slot />
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const { verifyAuth } = useAuthStore();

useHead({
  title: 'VueAI.tools',
  script: [
    {
      async: true,
      src: 'https://umami.vueai.tools/script.js',
      'data-website-id': '716766be-9975-4463-be2d-2a8b39c8d4cb',
    }
  ],
});

onMounted(() => {  
  verifyAuth();
});
</script>