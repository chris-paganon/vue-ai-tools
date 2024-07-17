import {
  ContextChatEngine,
  VectorStoreIndex,
  QdrantVectorStore,
  Settings,
  Ollama,
  HuggingFaceEmbedding,
  SimilarityPostprocessor,
  type NodeWithScore,
  type Metadata,
} from 'llamaindex';
import { isChatMessageArray } from '@/types/types';
import type { User } from 'lucia';

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
    await setLlamaindexSettings(event.context.user);

    const vueDocsIndexName = runtimeConfig.vueDocsIndexName;
    const vectorStoreUrl = runtimeConfig.vectorStoreUrl;
    const vectorStore = new QdrantVectorStore({
      url: vectorStoreUrl,
      collectionName: vueDocsIndexName,
    });
    const loadedIndex = await VectorStoreIndex.fromVectorStore(vectorStore);
    const retriever = loadedIndex.asRetriever({
      topK: { TEXT: 3, IMAGE: 0 },
    });
    const postProcessor = new SimilarityPostprocessor({
      similarityCutoff: 0.35,
    });

    let systemPrompt = messages.find(
      (message) => message.role === 'system'
    )?.content;
    if (typeof systemPrompt !== 'string') {
      systemPrompt = 'You are a chatbot specialized in Vue.js.';
    }

    const chatEngine = new ContextChatEngine({
      retriever,
      nodePostprocessors: [postProcessor],
      chatModel: Settings.llm,
      systemPrompt,
    });

    const chatHistory = messages.filter((m) => m.role !== 'system');
    const chatResponse = await chatEngine.chat({
      message: chatHistory[chatHistory.length - 1].content,
      chatHistory,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        let sourcesHtml = '';
        for await (const part of chatResponse) {
          const sourceNodes = part.sourceNodes;
          if (!sourcesHtml && sourceNodes && sourceNodes.length > 0) {
            sourcesHtml = getSourcesHtml(sourceNodes);
          }
          controller.enqueue(part.response);
        }
        if (sourcesHtml) {
          controller.enqueue(sourcesHtml);
        }
        controller.close();
      },
    });

    return stream;
  } catch (error) {
    console.log('error: ', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown OpenAI API error',
    });
  }
});

async function setLlamaindexSettings(user: User | null) {
  const runtimeConfig = useRuntimeConfig();

  if (runtimeConfig.aiEnvironment === 'local') {
    Settings.llm = new Ollama({
      model: runtimeConfig.localLlmModel,
    });
    Settings.embedModel = new HuggingFaceEmbedding({
      modelType: runtimeConfig.localEmbedModel,
      quantized: false,
    });
    return Settings;
  }

  let model = 'deepseek-coder';
  if (user && (await useIsSubscribed(user))) {
    model = 'deepseek-coder';
  }

  Settings.llm = new DeepseekLLM({
    model,
    temperature: 0.6,
    apiKey: runtimeConfig.deepseekApiKey,
  });
  Settings.embedModel = new CohereEmbedding({
    apiKey: runtimeConfig.cohereApiKey,
  });

  return Settings;
}

function getSourcesHtml(sourceNodes: NodeWithScore<Metadata>[]) {
  let sourcesHtml = '';
  sourcesHtml += '\n<p>References:<ul>';
  const existingUrls: string[] = [];
  sourceNodes.forEach((source) => {
    if (
      source.node.metadata.url &&
      !existingUrls.includes(source.node.metadata.url)
    ) {
      sourcesHtml += `<li><a href="${source.node.metadata.url}" target="_blank">${source.node.metadata.url}</a></li>`;
      existingUrls.push(source.node.metadata.url);
    }
  });
  sourcesHtml += '</ul></p>';
  return sourcesHtml;
}
