import {
  ContextChatEngine,
  VectorStoreIndex,
  QdrantVectorStore,
  TogetherLLM,
  TogetherEmbedding,
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
    const togetherApiKey = useRuntimeConfig().togetherApiKey;
    let model = 'meta-llama/Llama-3-8b-chat-hf';
    if (event.context.user && (await useIsSubscribed(event.context.user))) {
      model = 'meta-llama/Llama-3-70b-chat-hf';
    }
    Settings.llm = new TogetherLLM({
      model,
      apiKey: togetherApiKey,
    });
    Settings.embedModel = new TogetherEmbedding({
      model: 'togethercomputer/m2-bert-80M-2k-retrieval',
      apiKey: togetherApiKey,
    });

    const vectorStore = new QdrantVectorStore({
      url: 'http://localhost:6333',
      collectionName: 'vue-docs',
    });
    const loadedIndex = await VectorStoreIndex.fromVectorStore(vectorStore);
    const retriever = loadedIndex.asRetriever();

    let systemPrompt = messages.find(
      (message) => message.role === 'system'
    )?.content;
    if (typeof systemPrompt !== 'string') {
      systemPrompt = 'You are a chatbot specialized in Vue.js.';
    }

    const chatEngine = new ContextChatEngine({
      retriever,
      chatModel: Settings.llm,
      systemPrompt,
    });

    const chatHistory = messages.filter((m) => m.role !== 'system');
    const { response, sourceNodes } = await chatEngine.chat({
      message: chatHistory[chatHistory.length - 1].content,
      chatHistory,
      stream: false,
    });

    let responseMessage = response;
    if (sourceNodes) {
      sourceNodes.forEach((source) => {
        if (source.node.metadata.file_name) {
          responseMessage += `\n\n Reference: ${source.node.metadata.file_name}`;
        }
      });
    }
    return responseMessage;
  } catch (error) {
    console.log('error: ', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown OpenAI API error',
    });
  }
});
