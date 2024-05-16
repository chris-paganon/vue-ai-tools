export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      message: 'Must be signed in to get active subscriptions',
      statusCode: 403,
    });
  }

  return await useGetStillActiveSubscriptions(user);
});
