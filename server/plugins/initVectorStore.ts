import {
  storageContextFromDefaults,
  SimpleDirectoryReader,
  VectorStoreIndex,
  QdrantVectorStore,
  Settings,
  TogetherEmbedding,
} from 'llamaindex';
import { QdrantClient } from '@qdrant/js-client-rest';

export default defineNitroPlugin(async () => {
  console.log('Initializing VectorStoreIndex');

  const qdrantClient = new QdrantClient({ host: 'localhost', port: 6333 });
  const vueDocsExists = await qdrantClient.collectionExists('vue-docs');
  if (vueDocsExists.exists) {
    console.log('Collection exists, skipping index creation');
    return;
  }

  console.log('Setting up embeddings');
  const togetherApiKey = useRuntimeConfig().togetherApiKey;
  Settings.embedModel = new TogetherEmbedding({
    model: 'togethercomputer/m2-bert-80M-2k-retrieval',
    apiKey: togetherApiKey,
  });

  console.log('Loading documents');
  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: './public/vue-docs/files',
  });
  const vectorStore = new QdrantVectorStore({
    url: 'http://localhost:6333',
    collectionName: 'vue-docs',
  });
  const storageContext = await storageContextFromDefaults({ vectorStore });

  console.log('Creating index');
  await VectorStoreIndex.fromDocuments(documents, {
    storageContext,
  });

  console.log('Index ready');
});
