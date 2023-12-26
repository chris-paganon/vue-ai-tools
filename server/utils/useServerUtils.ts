import PocketBase from 'pocketbase';
import { H3Event } from 'h3';

export function fixTypesSerialization<T>(object: T[]): ({toJSON(): T[]}) {
  const data = {
    toJSON() {
      return object;
    }
  }
  return data;
}

export function useGetVerifiedUserPb(event: H3Event) {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl);
  
  const rawPbCookie = getCookie(event, 'pb_auth');
  if (!rawPbCookie) return pb;
  const pbCookie = JSON.parse(rawPbCookie);
  if (!pbCookie.token || !pbCookie.model) return pb;
  
  pb.authStore.save(pbCookie.token, pbCookie.model);

  return pb;
}

export async function useGetAdminPb() {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const { pbAdminEmail, pbAdminPassword } = useRuntimeConfig();
  const pb = new PocketBase(pbUrl);
  await pb.admins.authWithPassword(pbAdminEmail, pbAdminPassword);
  return pb;
}