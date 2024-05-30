FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ENV NUXT_TOGETHER_API_KEY="your-api-key"

CMD [ "python", "./main.py" ]