export default defineNuxtPlugin(async () => {
	const { verifyAuth } = useAuthStore();
	const { setNewChat, getChatsFromDb } = useChatStore();
	
	await verifyAuth();
	await getChatsFromDb();
	setNewChat();
});