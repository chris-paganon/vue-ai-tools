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

#### Where is the data stored?
The chat history is stored in a SQLite database in the `db/sqlite.db` file.

#### Optional: User creation
To easily access existing chats, you may want to create a user. You can simply do so by using the sign up button. However, if you don't set a sendgrid API key, you won't be able to receive the confirmation email. This won't prevent you from using the app, but you will get a message in the top bar. 

If you want to get rid of the message without connecting to an external email API, you have to manually confirm the user in the database:
- download sqlitebrowser: https://sqlitebrowser.org/
- open the `db/sqlite.db` file with sqlitebrowser.
- go to the `user` table and set `email_verified` to `1` for your newly created user.