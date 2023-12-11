export const useAuthStore = defineStore('auth', () => {

  const chatStore = useChatStore();
  const isSignedIn = ref(false);

  async function logout() {
    const { $pb } = useNuxtApp();
    $pb.authStore.clear();
    await resetAfterLogout();
  }

  async function resetAfterLogout() {
    isSignedIn.value = false;
    chatStore.$reset();
    await navigateTo('/');
  }

  return {
    isSignedIn,
    logout,
    resetAfterLogout,
  };
});