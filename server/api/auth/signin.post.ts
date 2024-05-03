export default eventHandler(async (event) => {
  const body = await readBody(event);
  const email = body.email;

  // TODO: Properly validate these
  if (typeof email !== 'string') {
    throw createError({
      message: 'Invalid username',
      statusCode: 400,
    });
  }
  const password = body.password;
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({
      message: 'Invalid password',
      statusCode: 400,
    });
  }

  const existingUser = await useVerifyPassword(email, password);
  if (!existingUser) {
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize()
  );
});
