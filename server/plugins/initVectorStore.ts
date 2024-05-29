import {
  storageContextFromDefaults,
  SimpleDirectoryReader,
  VectorStoreIndex,
  Settings,
  TogetherEmbedding,
} from 'llamaindex';

export default defineNitroPlugin(async () => {
  console.log('Initializing VectorStoreIndex');

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
  const storageContext = await storageContextFromDefaults({
    persistDir: './storage',
  });

  console.log('Creating index');
  await VectorStoreIndex.fromDocuments(documents, {
    storageContext,
  });

  console.log('Index ready');
});
