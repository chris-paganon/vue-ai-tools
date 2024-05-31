FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ENV NUXT_TOGETHER_API_KEY="your-api-key"
ENV NUXT_VUE_DOCS_INDEX_NAME="vue-docs"

CMD [ "python", "-u", "./main.py" ]