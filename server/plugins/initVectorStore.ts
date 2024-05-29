import {
  storageContextFromDefaults,
  SimpleDirectoryReader,
  VectorStoreIndex,
  Settings,
  HuggingFaceEmbedding,
  Ollama,
} from 'llamaindex';

export default defineNitroPlugin(async () => {
  console.log('Initializing VectorStoreIndex');

  console.log('Setting up llama3');
  Settings.llm = new Ollama({
    model: 'llama3',
  });

  console.log('Setting up embeddings');
  Settings.embedModel = new HuggingFaceEmbedding({
    modelType: 'BAAI/bge-small-en-v1.5',
    quantized: false,
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
