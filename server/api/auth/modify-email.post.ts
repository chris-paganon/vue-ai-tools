export default eventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 403,
    });
  }

  const { newEmail } = await readBody(event);
  if (typeof newEmail !== 'string' || !/\S+@\S+\.\S+/.test(newEmail)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
    });
  }

  const verificationCode = await generateEmailVerificationCode(
    user.id,
    newEmail
  );
  await sendVerificationCode(user.email, verificationCode);
});
