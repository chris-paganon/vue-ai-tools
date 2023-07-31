export async function useAskQuestion() {
  const { messages } = storeToRefs(useChatStore());
  const { addAssistantMessage } = useChatStore();
  
  const { data } = await useFetch('/api/completion', {
    method: 'post',
    body: {
      messages: messages.value,
    },
  });
  
  if (!data.value) return;
  addAssistantMessage(data.value);
}