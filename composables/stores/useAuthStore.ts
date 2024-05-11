import type { subscriptionsTable } from '~/db/schema/subscriptionsSchema';
import type { User } from 'lucia';
import type { InferSelectModel } from 'drizzle-orm';

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
    subscriptions.value = undefined;
    setIsSubscribed(false);
    setSubscriptionLoaded(false);
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

  const subscriptions = ref<
    InferSelectModel<typeof subscriptionsTable>[] | undefined
  >(undefined);
  function setSubscriptions(
    value: InferSelectModel<typeof subscriptionsTable>[]
  ) {
    subscriptions.value = value;
  }
  function resetSubscriptions() {
    subscriptions.value = undefined;
  }

  const subscriptionsLoaded = ref(false);
  function setSubscriptionLoaded(value: boolean) {
    subscriptionsLoaded.value = value;
  }
  async function setSubscriptionStatus() {
    const { data } = await useFetch('/api/subscriptions/active');
    console.log('🚀 ~ setSubscriptionStatus ~ data:', data);
    if (!data.value || data.value.length === 0) {
      setIsSubscribed(false);
      resetSubscriptions();
      setSubscriptionLoaded(true);
      return;
    }

    setSubscriptions(data.value);
    setSubscriptionLoaded(true);

    if (data.value.length === 0) return;
    setIsSubscribed(true);
  }

  return {
    user,
    isSignedIn,
    isSubscribed,
    subscriptions,
    setIsSignedIn,
    setUser,
    setIsSubscribed,
    logout,
    initAccount,
    maybeInitAccount,
    setSubscriptionStatus,
  };
});
