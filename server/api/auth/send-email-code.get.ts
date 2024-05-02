export default eventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 403,
    });
  }

  const verificationCode = await generateEmailVerificationCode(
    user.id,
    user.email
  );
  await sendVerificationCode(user.email, verificationCode);
});
