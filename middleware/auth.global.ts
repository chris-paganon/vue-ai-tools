export default defineNuxtRouteMiddleware(async () => {
  const { data } = await useFetch('/api/auth/user');

  if (!data.value) {
    const { resetAfterLogout } = useAuthStore();
    await resetAfterLogout();
    return;
  }

  const { setIsSignedIn, setUser } = useAuthStore();
  setIsSignedIn(true);
  setUser(data.value);
});
