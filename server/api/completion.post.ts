import OpenAI from 'openai';
import ollama from 'ollama';
import {
  isChatCompletionMessages,
  type ChatCompletionMessage,
} from '~/types/types';
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

async function remoteChatCompletion(
  event: H3Event,
  messages: ChatCompletionMessage[]
) {
  let model = 'deepseek-coder';
  if (event.context.user && (await useIsSubscribed(event.context.user))) {
    model = 'deepseek-coder';
  }
  const data: OpenAI.Chat.ChatCompletionCreateParamsStreaming = {
    model,
    temperature: 0.6,
    messages,
    stream: true,
  };

  const runtimeConfig = useRuntimeConfig();
  const openai = new OpenAI({
    apiKey: runtimeConfig.deepseekApiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });
  const response = await openai.chat.completions.create(data);
  const stream = new ReadableStream({
    async start(controller) {
      for await (const part of response) {
        if (part.choices) {
          for (const choice of part.choices) {
            if (choice.delta.content === null) continue;
            controller.enqueue(choice.delta.content);
          }
        }
        if (part.choices.length === 0) {
          controller.close();
        }
      }
      controller.close();
    },
  });
  return stream;
}

async function localChatCompletion(messages: ChatCompletionMessage[]) {
  const runtimeConfig = useRuntimeConfig();
  const response = await ollama.chat({
    model: runtimeConfig.localLlmModel,
    messages,
    stream: true,
  });
  const stream = new ReadableStream({
    async start(controller) {
      for await (const part of response) {
        if (part.message?.content) {
          controller.enqueue(part.message.content);
        }
        if (part.done) {
          controller.close();
        }
      }
      controller.close();
    },
  });
  return stream;
}
