import {
  ContextChatEngine,
  VectorStoreIndex,
  QdrantVectorStore,
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
    const runtimeConfig = useRuntimeConfig();
    const togetherApiKey = runtimeConfig.togetherApiKey;
    let model: 'command-r' | 'command-r-plus' = 'command-r';
    if (event.context.user && (await useIsSubscribed(event.context.user))) {
      model = 'command-r-plus';
    }
    Settings.llm = new CohereLLM({
      model,
      apiKey: runtimeConfig.cohereApiKey,
    });
    Settings.embedModel = new TogetherEmbedding({
      model: 'togethercomputer/m2-bert-80M-2k-retrieval',
      apiKey: togetherApiKey,
    });

    const vueDocsIndexName = runtimeConfig.vueDocsIndexName;
    const vectorStoreUrl = runtimeConfig.vectorStoreUrl;
    const vectorStore = new QdrantVectorStore({
      url: vectorStoreUrl,
      collectionName: vueDocsIndexName,
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
      responseMessage += '<p>References:<ul>';
      const existingUrls: string[] = [];
      sourceNodes.forEach((source) => {
        if (
          source.node.metadata.url &&
          !existingUrls.includes(source.node.metadata.url)
        ) {
          responseMessage += `<li><a href="${source.node.metadata.url}" target="_blank">${source.node.metadata.url}</a></li>`;
          existingUrls.push(source.node.metadata.url);
        }
      });
      responseMessage += '</ul></p>';
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
