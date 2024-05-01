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

  // TODO: Move subscription handling to a separate store when more logic is added.
  const isSubscribed = ref(false);
  function setIsSubscribed(value: boolean) {
    isSubscribed.value = value;
  }

  async function setSubscriptionStatus() {
    const { $pb } = useNuxtApp();
    const subscriptions = await $pb.collection('subscriptions').getFullList();
    if (!subscriptions || subscriptions.length === 0) return;
    
    if (subscriptions.some((subscription) => subscription.status === 'active')) {
      setIsSubscribed(true);
    }
  }

  return {
    isSignedIn,
    isSubscribed,
    setIsSignedIn,
    setIsSubscribed,
    logout,
    resetAfterLogout,
    setSubscriptionStatus,
  };
});