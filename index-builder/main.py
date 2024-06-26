import os
from dotenv import load_dotenv, dotenv_values

from llama_index.core import (
  Settings,
  VectorStoreIndex,
  SimpleDirectoryReader,
  StorageContext
)
from llama_index.embeddings.cohere import CohereEmbedding
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore

load_dotenv()

docs_index = [
  {
    "path": "vuejs/src/guide",
    "base_url": "https://vuejs.org/guide",
    "library": "vuejs",
    "library_description": "Main VueJS framework",
    "directory_description": "Main documentation for VueJS"
  },
  {
    "path": "pinia/packages/docs/core-concepts",
    "base_url": "https://pinia.vuejs.org/core-concepts",
    "library": "pinia",
    "library_description": "State Management for VueJS",
    "directory_description": "Pinia core concepts main documentation"
  },
  {
    "path": "router/packages/docs/guide",
    "base_url": "https://router.vuejs.org/guide",
    "library": "vue-router",
    "library_description": "Official Router for VueJS",
    "directory_description": "Vue Router main documentation"
  }
]

def add_url_meta(file_path):
  for doc_index in docs_index:
    if doc_index['path'] in file_path:
      relative_path = file_path.split(doc_index['path'])[1]
      file_extension = relative_path.split('.')[-1]
      relative_url_path = relative_path.replace('.' + file_extension, '')

      return {
        "url": doc_index['base_url'] + relative_url_path,
        "library": doc_index['library'],
        "library_description": doc_index['library_description'],
        "directory_description": doc_index['directory_description'],
      }
  return {}

def build_index():
  print("Initializing index builder")
  db_client = qdrant_client.QdrantClient(
    host="vector-db",
    port=6333
  )

  if db_client.collection_exists(os.getenv('NUXT_VUE_DOCS_INDEX_NAME')):
    print("Collection already exists, skipping index building")
    return
  
  documents = []
  for doc_index in docs_index:
    print('Building documents for', doc_index['path'])
    reader = SimpleDirectoryReader(
      input_dir=doc_index['path'],
      recursive=True,
      file_metadata=add_url_meta,
      required_exts=[".md"]
    )
    documents += reader.load_data()
    print('Documents built successfully for', doc_index['path'])

  print('Creating vector store')
  vector_store = QdrantVectorStore(
    client=db_client, 
    collection_name=os.getenv('NUXT_VUE_DOCS_INDEX_NAME')
  )
  storage_context = StorageContext.from_defaults(vector_store=vector_store)

  print('Indexing documents')
  embed_model = CohereEmbedding(
    model_name="embed-english-v3.0",
    api_key=os.getenv('NUXT_COHERE_API_KEY'),
    input_type="search_document",
    embedding_type="float",
  )
  index = VectorStoreIndex.from_documents(
    documents,
    storage_context=storage_context,
    embed_model=embed_model,
    show_progress=True
  )
  print('Full index built successfully')

build_index()