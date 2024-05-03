import { verifyRequestOrigin } from 'lucia';
import type { Session, User } from 'lucia';

export default defineEventHandler(async (event) => {
  // This is already set by nuxt-security module everywhere. We add it here just in case security module is disabled.
  const requestPath = getRequestURL(event).pathname;
  if (requestPath.includes('reset-password')) {
    setHeader(event, 'Referrer-Policy', 'no-referrer');
  }

  if (event.method !== 'GET' && !requestPath.includes('webhook')) {
    const originHeader = getHeader(event, 'Origin') ?? null;
    const hostHeader = getHeader(event, 'Host') ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return event.node.res.writeHead(403).end();
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendResponseHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    appendResponseHeader(
      event,
      'Set-Cookie',
      lucia.createBlankSessionCookie().serialize()
    );
  }
  event.context.session = session;
  event.context.user = user;
});

declare module 'h3' {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
