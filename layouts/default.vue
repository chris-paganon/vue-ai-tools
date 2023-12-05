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
const { setNewChat, getChatsFromDb } = useChatStore();

useHead({
  title: 'VueAI.tools',
  script: [
    {
      async: true,
      src: 'https://umami.vueai.tools/script.js',
      'data-website-id': '26f8c670-c065-4261-b86e-cbca5ed11822',
    }
  ],
});

onMounted(async () => {  
  await verifyAuth();
  await getChatsFromDb();
  setNewChat();
});
</script>