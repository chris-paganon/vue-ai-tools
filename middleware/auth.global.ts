export default defineNuxtRouteMiddleware(async () => {
  const headers = useRequestHeaders(['cookie']);
  const user = await $fetch('/api/auth/user', { headers });

  if (!user) {
    const { resetAfterLogout } = useAuthStore();
    await resetAfterLogout();
    return;
  }

  const { setIsSignedIn, setUser } = useAuthStore();
  setIsSignedIn(true);
  setUser(user);
});
