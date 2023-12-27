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

export async function useGetVerifiedUserPbId(event: H3Event) {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl);
  
  const rawPbCookie = getCookie(event, 'pb_auth');
  if (!rawPbCookie) return;
  const pbCookie = JSON.parse(rawPbCookie);
  if (!pbCookie.token || !pbCookie.model.id) return;

  pb.authStore.save(pbCookie.token, pbCookie.model);

  try {
    await pb.collection('users').authRefresh();
  } catch (error) {
    return;
  }  
  return pb.authStore.model?.id;
}

export async function useGetAdminPb() {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const { pbAdminEmail, pbAdminPassword } = useRuntimeConfig();
  const pb = new PocketBase(pbUrl);
  await pb.admins.authWithPassword(pbAdminEmail, pbAdminPassword);
  return pb;
}