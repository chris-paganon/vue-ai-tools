export default eventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 403,
    });
  }

  const { newEmail, password } = await readBody(event);
  if (typeof newEmail !== 'string' || !/\S+@\S+\.\S+/.test(newEmail)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
    });
  }
  if (typeof password !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid password',
    });
  }

  const existingUser = await useVerifyPassword(user.email, password);
  if (!existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Incorrect password',
    });
  }

  const verificationCode = await generateEmailVerificationCode(
    user.id,
    newEmail
  );
  await sendVerificationCode(user.email, verificationCode);
});
