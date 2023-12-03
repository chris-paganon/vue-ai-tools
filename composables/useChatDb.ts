import Pocketbase from 'pocketbase';
import OpenAI from 'openai';

export async function useHandleChatDb(message: OpenAI.Chat.Completions.ChatCompletionMessageParam, currentChatId: string, currentChatName: string) {
	const chatRecordId = await useMaybeAddChatToDb(currentChatId, currentChatName);
	useAddMessageToDb(message, chatRecordId);

	return chatRecordId;
}

export async function useMaybeAddChatToDb(currentChatId: string, currentChatName: string) {
	const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
	const pb = new Pocketbase(pbUrl);

	if ( (!pb.authStore.isValid || !pb.authStore.model) && !currentChatId ) {
		const pbChatRecord = await pb.collection('chats').create({
			name: currentChatName,
		});
		return pbChatRecord.id;
	}
	
	if ( !pb.authStore.isValid || !pb.authStore.model ) {
		// If not connected, no need to update the chat in DB. We only create one above.
		return currentChatId;
	}

	if (!currentChatId) {
		const pbChatRecord = await pb.collection('chats').create({
			user: pb.authStore.model.id,
			name: currentChatName,
		});
		return pbChatRecord.id;
	}

	const pbChatRecord = await pb.collection('chats').update(currentChatId, {
		user: pb.authStore.model.id,
		name: currentChatName,
	});
	return pbChatRecord.id;
}

export async function useAddMessageToDb(message: OpenAI.Chat.Completions.ChatCompletionMessageParam, chatId: string) {
	const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
	const pb = new Pocketbase(pbUrl);

	pb.collection('chat_messages').create({
    chat: chatId,
    role: message.role,
    content: message.content,
  });
}