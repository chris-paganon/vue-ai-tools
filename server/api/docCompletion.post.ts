import {
  storageContextFromDefaults,
  ContextChatEngine,
  VectorStoreIndex,
  Settings,
  type ChatMessage,
} from 'llamaindex';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const messages = body.messages;

  if (!messages) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing messages',
    });
  }
  if (!isChatMessageArray(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid messages',
    });
  }

  try {
    const secondStorageContext = await storageContextFromDefaults({
      persistDir: './storage',
    });
    const loadedIndex = await VectorStoreIndex.init({
      storageContext: secondStorageContext,
    });
    const retriever = loadedIndex.asRetriever();

    let systemPrompt = messages.find((message) => message.role === 'system')
      ?.content as string | undefined;
    if (!systemPrompt) {
      systemPrompt = 'You are a chatbot specialized in Vue.js.';
    }

    const chatEngine = new ContextChatEngine({
      retriever,
      chatModel: Settings.llm,
      systemPrompt,
    });

    const chatHistory = messages.filter((m) => m.role !== 'system');
    const response = await chatEngine.chat({
      message: chatHistory[chatHistory.length - 1].content,
      chatHistory,
      stream: false,
    });
    console.log('🚀 ~ rag-chat ~ response:', response);
    return response.response;
  } catch (error) {
    console.log('error: ', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown OpenAI API error',
    });
  }
});

function isChatMessage(obj: unknown): obj is ChatMessage {
  if (
    !obj ||
    typeof obj !== 'object' ||
    !('content' in obj) ||
    !('role' in obj)
  )
    return false;

  if (typeof obj.content !== 'string') return false;
  if (typeof obj.role !== 'string') return false;
  if (obj.role !== 'user' && obj.role !== 'assistant' && obj.role !== 'system')
    return false;

  return true;
}
function isChatMessageArray(obj: unknown): obj is ChatMessage[] {
  if (!Array.isArray(obj)) return false;
  return obj.every(isChatMessage);
}
