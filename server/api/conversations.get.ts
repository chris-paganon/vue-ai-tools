export default defineEventHandler(async (event) => {
  return await useGetConversations(event);
});