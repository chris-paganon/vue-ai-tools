import type { User } from 'lucia';

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const email = body.email;

  // TODO: Properly validate these
  if (typeof email !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid username',
    });
  }
  const password = body.password;
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid password',
    });
  }

  const existingUser = await useVerifyPassword(email, password);
  if (!existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Incorrect username or password',
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize()
  );

  const userAttributes: User = {
    id: existingUser.id,
    email: existingUser.email,
    created: existingUser.created,
    updated: existingUser.updated,
    stripeId: existingUser.stripeId,
    emailVerified: existingUser.emailVerified,
    emailConsent: existingUser.emailConsent,
  };
  return userAttributes;
});
