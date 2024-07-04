import OpenAI from 'openai';
import ollama from 'ollama';
import { isChatCompletionMessages, type ChatCompletionMessage } from '~/types/types';
import type { H3Event } from 'h3';

export default defineEventHandler(async (event) => {
  console.log('completion request received');

  const body = await readBody(event);
  const messages = body.messages;

  if (!messages) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing messages',
    });
  }
  if (!isChatCompletionMessages(messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid messages',
    });
  }

  try {
    const runtimeConfig = useRuntimeConfig();
    if (runtimeConfig.aiEnvironment === 'local') {
      return await localChatCompletion(messages);
    }
    return await remoteChatCompletion(event, messages);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.log('error: ', error.error); // Error info
      console.log('status: ', error.status); // 400
      console.log('error name: ', error.name); // BadRequestError
      console.log('error headers: ', error.headers); // {server: 'nginx', ...}
      throw createError({
        statusCode: error.status,
        statusMessage: 'OpenAI API error',
      });
    }
    console.log('error: ', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown OpenAI API error',
    });
  }
});

async function remoteChatCompletion(event: H3Event, messages: ChatCompletionMessage[]) {
  let model = 'deepseek-coder';
  if (event.context.user && (await useIsSubscribed(event.context.user))) {
    model = 'deepseek-coder';
  }
  const data: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
    model,
    temperature: 0.6,
    messages,
  };

  const runtimeConfig = useRuntimeConfig()
  const openai = new OpenAI({
    apiKey: runtimeConfig.deepseekApiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });
  const completion = await openai.chat.completions.create(data);
  if (completion.choices.length === 0) return;
  return completion.choices[0].message.content;
}

async function localChatCompletion(messages: ChatCompletionMessage[]) {
  const response = await ollama.chat({
    model: 'llama3:instruct',
    messages,
  })
  return response.message.content;
}