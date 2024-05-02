export default defineNuxtPlugin(async () => {
  const { isSignedIn } = storeToRefs(useAuthStore());
  if (!isSignedIn.value) return;

  const { setNewChat, getChatsFromDb } = useChatStore();
  await getChatsFromDb();
  setNewChat();

  const { setSubscriptionStatus } = useAuthStore();
  await setSubscriptionStatus();
});
