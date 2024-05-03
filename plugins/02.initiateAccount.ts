export default defineNuxtPlugin(async () => {
  const { data } = await useFetch('/api/auth/user');
  const { loginOrReset } = useAuthStore();

  const isLoggedIn = await loginOrReset(data.value);
  if (!isLoggedIn) return;

  const { setNewChat, getChatsFromDb } = useChatStore();
  await getChatsFromDb();
  setNewChat();

  const { setSubscriptionStatus } = useAuthStore();
  await setSubscriptionStatus();
});
