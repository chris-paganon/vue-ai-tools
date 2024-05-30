import os
import json
import datetime
# from dotenv import load_dotenv, dotenv_values

# load_dotenv()

def build_index():
  docs_index = [
    {
      "path": "vuejs/src/guide",
      "base_url": "https://vuejs.org/guide"
    },
    {
      "path": "vuejs/src/api",
      "base_url": "https://vuejs.org/api"
    },
    {
      "path": "pinia/packages/docs/core-concepts",
      "base_url": "https://pinia.vuejs.org/core-concepts"
    },
    {
      "path": "pinia/packages/docs/api",
      "base_url": "https://pinia.vuejs.org/api"
    },
    {
      "path": "pinia/packages/docs/cookbook",
      "base_url": "https://pinia.vuejs.org/cookbook"
    },
    {
      "path": "router/packages/docs/guide",
      "base_url": "https://router.vuejs.org/guide"
    },
    {
      "path": "router/packages/docs/api",
      "base_url": "https://router.vuejs.org/api"
    }
  ]

  for doc_index in docs_index:
    for dirpath, dirs, files in os.walk(doc_index["path"]):
      for file in files:
        if ".md" in file:
          file_path = dirpath + '/' + file

          # TODO: Replace with llamaindex data ingestion for qdrant DB
          # json_file_content.append({
          #   "filename": file,
          #   "url": doc_index["base_url"] + relative_file_path + '/' + file.replace('.md', '.html')
          # })

build_index()