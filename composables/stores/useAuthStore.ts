export const useAuthStore = defineStore('auth', () => {

  const chatStore = useChatStore();
  const isSignedIn = ref(false);

  function setIsSignedIn(value: boolean) {
    isSignedIn.value = value;
  }

  async function logout() {
    const { $pb } = useNuxtApp();
    $pb.authStore.clear();
    await resetAfterLogout();
    await navigateTo('/');
  }

  async function resetAfterLogout() {
    setIsSignedIn(false);
    chatStore.$reset();
  }

  return {
    isSignedIn,
    setIsSignedIn,
    logout,
    resetAfterLogout,
  };
});