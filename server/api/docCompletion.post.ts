import {
  storageContextFromDefaults,
  ContextChatEngine,
  VectorStoreIndex,
  TogetherLLM,
  Settings,
} from 'llamaindex';
import { isChatMessageArray } from '@/types/types';

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

    const togetherApiKey = useRuntimeConfig().togetherApiKey;
    let model = 'meta-llama/Llama-3-8b-chat-hf';
    if (event.context.user && (await useIsSubscribed(event.context.user))) {
      model = 'meta-llama/Llama-3-70b-chat-hf';
    }
    Settings.llm = new TogetherLLM({
      model,
      apiKey: togetherApiKey,
    });
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
