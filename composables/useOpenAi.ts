export async function useAskQuestion() {
  const { messages } = storeToRefs(useChatStore());
  const { addAssistantMessage } = useChatStore();
  
  const response = await $fetch('/api/completion', {
    method: 'POST',
    body: {
      messages: messages.value,
    },
  });
  
  if (!response) return;
  addAssistantMessage(response);
}