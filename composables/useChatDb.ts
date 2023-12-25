import OpenAI from 'openai';

export async function useHandleChatDb(message: OpenAI.Chat.Completions.ChatCompletionMessageParam, currentChatId: string, currentChatName: string) {
	const chatRecordId = await useMaybeAddChatToDb(currentChatId, currentChatName);
	useAddMessageToDb(message, chatRecordId);

	return chatRecordId;
}

export async function useMaybeAddChatToDb(currentChatId: string, currentChatName: string) {
	const { $pb } = useNuxtApp();
	if ( (!$pb.authStore.isValid || !$pb.authStore.model) && !currentChatId ) {
		const pbChatRecord = await $pb.collection('chats').create({
			name: currentChatName,
		});
		return pbChatRecord.id;
	}
	
	if ( !$pb.authStore.isValid || !$pb.authStore.model ) {
		// If not connected, no need to update the chat in DB. We only create one above.
		return currentChatId;
	}

	if (!currentChatId) {
		const pbChatRecord = await $pb.collection('chats').create({
			user: $pb.authStore.model.id,
			name: currentChatName,
		});
		return pbChatRecord.id;
	}

	const pbChatRecord = await $pb.collection('chats').update(currentChatId, {
		user: $pb.authStore.model.id,
		name: currentChatName,
	});
	return pbChatRecord.id;
}

export async function useAddMessageToDb(message: OpenAI.Chat.Completions.ChatCompletionMessageParam, chatId: string) {
	const { $pb } = useNuxtApp();

	$pb.collection('chat_messages').create({
    chat: chatId,
    role: message.role,
    content: message.content,
  });
}