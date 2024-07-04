FROM python:3.11

WORKDIR /usr/src/app

COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --only main --no-root --no-directory

COPY src/ ./src
RUN poetry install --only main

ENV NUXT_TOGETHER_API_KEY="your-api-key"
ENV NUXT_VUE_DOCS_INDEX_NAME="vue-docs"
ENV NUXT_AI_ENVIRONMENT="local"
ENV NUXT_LOCAL_EMBEDDING_MODEL=="BAAI/bge-small-en-v1.5"

CMD [ "poetry", "run", "python", "src" ]