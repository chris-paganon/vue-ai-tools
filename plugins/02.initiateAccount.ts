export default defineNuxtPlugin(async () => {
	const { setNewChat, getChatsFromDb } = useChatStore();
	
	await getChatsFromDb();
	setNewChat();
});