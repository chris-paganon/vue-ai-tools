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

  const isSignedIn = computed(() => !!user.value);
  const isVerified = computed(() => user.value?.emailVerified);

  async function logout() {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    });
    clearAccount();
    await navigateTo('/');
  }

  async function clearAccount() {
    resetUser();
    resetSubscriptions();
    setIsSubscribed(false);
    setSubscriptionLoaded(false);
    chatStore.$reset();
  }

  async function initAccount(user: User) {
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
    // This occurs if there is an error (e.g. user not signed in)
    if (!data.value) {
      resetSubscriptions();
      setIsSubscribed(false);
      return;
    }

    if (data.value.length === 0) {
      resetSubscriptions();
      setIsSubscribed(false);
      setSubscriptionLoaded(true);
      return;
    }

    setSubscriptions(data.value);
    setIsSubscribed(true);
    setSubscriptionLoaded(true);
  }

  return {
    user,
    isSignedIn,
    isVerified,
    isSubscribed,
    subscriptions,
    setUser,
    setIsSubscribed,
    logout,
    initAccount,
    maybeInitAccount,
    setSubscriptionStatus,
  };
});
