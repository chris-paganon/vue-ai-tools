import PocketBase, { type AuthModel } from 'pocketbase';
import type { TypedPocketBase } from '@/types/types';

export default defineNuxtPlugin(async () => {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl) as TypedPocketBase;

  const cookieAuthStore = useCookie('pb_auth', {
    path: '/',
    secure: true,
    sameSite: 'lax',
    httpOnly: false, // change to "true" if you want only server-side access
    maxAge: 604800,
    default: () => {
      return {
        token: '',
        model: {} as AuthModel,
      };
    },
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

  return {
    provide: { pb },
  };
});
