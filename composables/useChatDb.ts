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

	console.log('useMaybeAddChatToDb: ', pb.authStore.model, currentChatId, currentChatName);
	if (!pb.authStore.isValid || !pb.authStore.model) {
			const pbChatRecord = await pb.collection('conversations').create({
					name: currentChatName,
			});
			return pbChatRecord.id;
	}
	if (!currentChatId) {
			const pbChatRecord = await pb.collection('conversations').create({
					user: pb.authStore.model.id,
					name: currentChatName,
			});
			return pbChatRecord.id;
	}
	const pbChatRecord = await pb.collection('conversations').update(currentChatId, {
			user: pb.authStore.model.id,
			name: currentChatName,
	});
	return pbChatRecord.id;
}

export async function useAddMessageToDb(message: OpenAI.Chat.Completions.ChatCompletionMessageParam, chatId: string) {
	const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
	const pb = new Pocketbase(pbUrl);

	pb.collection('chat_messages').create({
    conversation: chatId,
    role: message.role,
    message: message.content,
  });
}