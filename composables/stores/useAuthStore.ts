import type { User } from 'lucia';

export const useAuthStore = defineStore('auth', () => {
  const chatStore = useChatStore();

  const user = ref<User | null>(null);
  function setUser(value: User) {
    user.value = value;
  }
  function resetUser() {
    if (user.value) {
      user.value = null;
    }
  }

  const isSignedIn = ref(false);
  function setIsSignedIn(value: boolean) {
    isSignedIn.value = value;
  }

  async function logout() {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    });
    clearAccount();
    await navigateTo('/');
  }

  async function clearAccount() {
    setIsSignedIn(false);
    resetUser();
    chatStore.$reset();
  }

  async function initAccount(user: User) {
    setIsSignedIn(true);
    setUser(user);

    const { chatsLoaded } = storeToRefs(useChatStore());
    if (!chatsLoaded.value) {
      const { setNewChat, getChatsFromDb } = useChatStore();
      await getChatsFromDb();
      setNewChat();
    }

    if (!subscriptionsLoaded.value) {
      await setSubscriptionStatus();
    }
  }

  async function maybeInitAccount(user: User | null) {
    if (!user) {
      clearAccount();
      return;
    }
    await initAccount(user);
  }

  // TODO: Move subscription handling to a separate store when more logic is added.
  const isSubscribed = ref(false);
  function setIsSubscribed(value: boolean) {
    isSubscribed.value = value;
  }

  const subscriptionsLoaded = ref(false);
  function setSubscriptionLoaded(value: boolean) {
    subscriptionsLoaded.value = value;
  }
  async function setSubscriptionStatus() {
    const { $pb } = useNuxtApp();
    const subscriptions = await $pb.collection('subscriptions').getFullList();
    if (!subscriptions || subscriptions.length === 0) return;

    if (
      subscriptions.some((subscription) => subscription.status === 'active')
    ) {
      setIsSubscribed(true);
      setSubscriptionLoaded(true);
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
    initAccount,
    maybeInitAccount,
    setSubscriptionStatus,
  };
});
