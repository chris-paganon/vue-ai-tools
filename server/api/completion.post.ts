import { CohereClient } from 'cohere-ai';
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

  let model: 'command-r' | 'command-r-plus' = 'command-r';
  if (event.context.user && (await useIsSubscribed(event.context.user))) {
    model = 'command-r-plus';
  }

  const chatHistory = messages.slice(0, -1).map((message) => {
    let cohereRole: 'USER' | 'CHATBOT' | 'SYSTEM' = 'USER';
    switch (message.role) {
      case 'user':
        cohereRole = 'USER';
        break;
      case 'assistant':
        cohereRole = 'CHATBOT';
        break;
      case 'system':
        cohereRole = 'SYSTEM';
        break;
    }

    return {
      message: message.content,
      role: cohereRole,
    };
  });

  try {
    const runtimeConfig = useRuntimeConfig();
    const cohere = new CohereClient({
      token: runtimeConfig.cohereApiKey,
    });
    const response = await cohere.chat({
      model,
      chatHistory,
      message: messages[messages.length - 1].content,
    });

    return response.text;
  } catch (error) {
    console.log('error: ', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unknown OpenAI API error',
    });
  }
});
