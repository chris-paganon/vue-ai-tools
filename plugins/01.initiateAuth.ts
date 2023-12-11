import PocketBase, { AuthModel } from 'pocketbase';

export default defineNuxtPlugin(async () => {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl);

  const cookieAuthStore = useCookie('pb_auth', {
    path:     '/',
    secure:   true,
    sameSite: 'strict',
    httpOnly: false, // change to "true" if you want only server-side access
    maxAge:   604800,
		default: () => {
			return {
				token: '',
				model: {} as AuthModel,
			}
		}
  });

  // load the store data from the cookie value
	if (cookieAuthStore.value.token && cookieAuthStore.value.model) {
		pb.authStore.save(cookieAuthStore.value.token, cookieAuthStore.value.model);
	}

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    cookieAuthStore.value = {
      token: pb.authStore.token,
      model: pb.authStore.model,
    };
  });

	const { isSignedIn } = storeToRefs(useAuthStore());
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		pb.authStore.isValid && await pb.collection('users').authRefresh();
		isSignedIn.value = true;
  } catch (error) {
		// clear the auth store on failed refresh
		console.log('failed to refresh auth, error: ', error);
		const { resetAfterLogout } = useAuthStore();
		await resetAfterLogout();
  }

  return {
    provide: { pb }
  }
});