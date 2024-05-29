import OpenAI from 'openai';
import { isChatCompletionMessages } from '~/types/types';

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

  let model = 'meta-llama/Llama-3-8b-chat-hf';
  if (event.context.user && (await useIsSubscribed(event.context.user))) {
    model = 'meta-llama/Llama-3-70b-chat-hf';
  }

  const data: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
    model,
    temperature: 0.4,
    messages,
  };

  const runtimeConfig = useRuntimeConfig();

  try {
    const openai = new OpenAI({
      apiKey: runtimeConfig.togetherApiKey,
      baseURL: 'https://api.together.xyz/v1',
    });
    const completion = await openai.chat.completions.create(data);
    if (completion.choices.length === 0) return;
    return completion.choices;
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
