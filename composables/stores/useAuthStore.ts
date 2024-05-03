import type { User } from 'lucia';

export const useAuthStore = defineStore('auth', () => {
  const chatStore = useChatStore();

  const user = ref<User | null>(null);
  function setUser(value: User) {
    user.value = value;
  }

  const isSignedIn = ref(false);
  function setIsSignedIn(value: boolean) {
    isSignedIn.value = value;
  }

  async function logout() {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    });
    await navigateTo('/');
  }
  async function resetAfterLogout() {
    setIsSignedIn(false);
    chatStore.$reset();
  }

  async function loginOrReset(user: User | null) {
    if (!user) {
      await resetAfterLogout();
      return false;
    }

    setIsSignedIn(true);
    setUser(user);
    return true;
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

    if (
      subscriptions.some((subscription) => subscription.status === 'active')
    ) {
      setIsSubscribed(true);
    }
  }

  return {
    user,
    isSignedIn,
    isSubscribed,
    setIsSignedIn,
    setUser,
    setIsSubscribed,
    logout,
    resetAfterLogout,
    loginOrReset,
    setSubscriptionStatus,
  };
});
