# VueAI.tools

Your go-to resource for AI tools tailored specifically for VueJS. The open source AI assistant uses the Vue documentation to provide more helpful answers, **links to the docs** and to **minimize errors and hallucinations**. The perfect assistant to **help you start** your VueJS journey.

## Local installation

These are the instructions to install the VueAI.tools web app locally, **including a local AI model & embeddings**. To install on remote server and to use remote AI models, embeddings, email server, etc... there would be additional steps.

### Prerequisites

- Node.js 20
- Docker & docker compose
- Ollama
  - Instal following the instructions: https://ollama.com/
  - Pull the llama3:instruct model: `ollama pull llama3:instruct`

### Basic installation

1. Clone the repository: `git clone --recurse-submodules https://github.com/chris-paganon/vue-ai-tools.git`.
2. Change directory: `cd vue-ai-tools`.
3. Install dependencies: `npm install`.
4. Copy the `.env.example` file to `.env` (the default values should work for local development).
5. Start the docker containers: `docker-compose up --build -d` and wait for the index to build.
6. Start the development server: `npm run dev`.
7. Open your browser and navigate to `http://localhost:3000`

This is it, you should now have the VueAI.tools web app running locally. You can start chatting with your fully local VueJS AI assistant. no data is sent to external servers.

#### Optional: Build the index outside docker

If you would like to build the local vector index from python directly instead of python inside docker (if you are having trouble with python & GPU inside docker for example).

**Building the index is not so computationally expensive, so you shouldn't need to do this**, even if you can't get your GPU working with docker. This should only be necessary for faster development of the index builder or if you want to build the index from more sources using a more powerful embedding model.

1st, you will need to intall the following dependencies on your computer:

- Python
- Python poetry

Then to build the index outside docker, follow these steps:

- Comment out the `index-builder` & `healthcheck` services in the `docker-compose.yml` file.
- Start the Qdrant vector database: `docker-compose up -d`.
- Change directory to the `index-builder` folder: `cd index-builder`.
- Install the python dependencies: `poetry install`.
- Run the index builder: `poetry run python src`.

#### Optional: User creation

To easily access existing chats, you may want to create a user. You can simply do so by using the sign up button. However, if you don't set a sendgrid API key, you won't be able to receive the confirmation email. This won't prevent you from using the app, but you will get a message in the top bar.

If you want to get rid of the message without connecting to an external email API, you have to manually confirm the user in the database:

- download sqlitebrowser: https://sqlitebrowser.org/
- open the `db/sqlite.db` file with sqlitebrowser.
- go to the `user` table and set `email_verified` to `1` for your newly created user.

### Where is the data stored?

The chat history is stored in a SQLite database in the `db/sqlite.db` file. Use sqlitebrowser or similar to view the data.

### Use different AI models

#### LLM

You can simply change the environment variables in the `.env` file to use different AI models. The default LLM model is `llama3:instruct` and the default embedding model is `BAAI/bge-small-en-v1.5`.

To use a different LLM model, make sure to pull the model with `ollama pull <model>` and then set the `NUXT_LOCAL_LLM_MODEL` environment variable to the model name in the `.env` file. The model should be one of the available models in the `ollama` tool: https://ollama.com/library. Otherwise follow Ollama instructions to add an other model.

#### Embeddings

To use a different embedding model, set the `NUXT_LOCAL_EMBEDDING_MODEL` environment variable to the model name in the `.env` file. The model should be one of the available `sentence-transformers` models in the Huggingface library: https://huggingface.co/models?library=sentence-transformers. Otherwise follow the LlamaIndex instructions to use an other model: https://docs.llamaindex.ai/en/stable/examples/embeddings/huggingface/.

**Important**: You need to rebuild the index if you change the embedding model. To do so:

- Make sure the Qdrant vector database is running: `docker-compose up -d`.
- Open the Qdrant dashboard: `http://localhost:6333/dashboard`.
- Delete the existing `vue-docs` index.
- Rebuild the index, either by rebulding & restarting the `index-builder` service in the `docker-compose.yml` file or by running the index builder outside docker with python poetry.

## Production installation guidelines

In order to run in production, you will need to set up a few more things. The following steps are necessary to run the VueAI.tools web app in production:

1. Clone the repository: `git clone --recurse-submodules https://github.com/chris-paganon/vue-ai-tools.git`.
2. Change directory: `cd vue-ai-tools`.
3. Install dependencies: `npm install`.
4. Copy the `.env.example` file to `.env` and set the necessary environment variables. NUXT_AI_ENVIRONMENT needs to be set to `remote` and all other variables need to be set to the correct values.
5. Build the app: `npm run build`.
6. Run the app with node or node inside a docker container.
7. Start the Qdrant vector database and build the index.
8. Make sure the app & Qdrant are accessible to each other.
9. Serve the app with a reverse proxy like Nginx or Caddy.
10. Maybe set a protected subdomain to access the qdrant dashboard.
