import PocketBase from 'pocketbase';
import { H3Event } from 'h3';

export function useVerifyPb(event: H3Event) {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl);
  
  const rawPbCookie = getCookie(event, 'pb_auth');
  if (!rawPbCookie) return pb;
  const pbCookie = JSON.parse(rawPbCookie);
  if (!pbCookie) return pb;
  
  pb.authStore.save(pbCookie.token, pbCookie.model);

  return pb;
}