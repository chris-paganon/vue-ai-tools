export default defineNuxtPlugin(async () => {
  const { data } = await useFetch('/api/auth/user');
  const { maybeInitAccount } = useAuthStore();
  await maybeInitAccount(data.value);
});
