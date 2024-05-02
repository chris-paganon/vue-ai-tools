import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '@/types/types';
import type { H3Event } from 'h3';

export function fixTypesSerialization<T>(object: T[]): { toJSON(): T[] } {
  const data = {
    toJSON() {
      return object;
    },
  };
  return data;
}

export async function useGetVerifiedUserPb(event: H3Event) {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl) as TypedPocketBase;

  const rawPbCookie = getCookie(event, 'pb_auth');
  if (!rawPbCookie) return;
  const pbCookie = JSON.parse(rawPbCookie);
  if (!pbCookie.token || !pbCookie.model.id) return;

  pb.authStore.save(pbCookie.token, pbCookie.model);

  try {
    if (!pb.authStore.isValid) {
      throw new Error('Invalid or expired auth');
    }
    await pb.collection('users').authRefresh();
  } catch (error) {
    return;
  }
  return pb.authStore.model;
}

export async function useGetAdminPb() {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const { pbAdminEmail, pbAdminPassword } = useRuntimeConfig();
  const pb = new PocketBase(pbUrl) as TypedPocketBase;
  await pb.admins.authWithPassword(pbAdminEmail, pbAdminPassword);
  return pb;
}
