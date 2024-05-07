import vueDocsIndex from '~/assets/vue-docs-index.json';
import OpenAI from 'openai';
import { isChatCompletionMessages, type ThreadMessage } from '~/types/types';

export default defineEventHandler(async (event) => {
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

  const runtimeConfig = useRuntimeConfig();
  const openai = new OpenAI({
    organization: runtimeConfig.openaiOrganization,
    apiKey: runtimeConfig.openaiApiKey,
  });

  const threadMessages = messages.filter(
    (message) => message.role !== 'system'
  ) as ThreadMessage[];
  const systemMessage = messages.find(
    (message) => message.role === 'system'
  )?.content;

  const thread = await openai.beta.threads.create({
    messages: threadMessages,
  });
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: 'asst_zgB5kTaei9AT4XFc13FTrwfg',
    instructions: systemMessage,
  });
  const threadResponseMessages = await openai.beta.threads.messages.list(
    run.thread_id
  );
  if (threadResponseMessages.data[0].content[0].type !== 'text') {
    throw createError({
      statusCode: 400,
      statusMessage: "Assistant didn't return text response.",
    });
  }

  const assistantResponseObj = threadResponseMessages.data[0].content[0].text;
  let assistantResponse = assistantResponseObj.value;

  if (assistantResponseObj.annotations.length > 0) {
    for (const annotation of assistantResponseObj.annotations) {
      if (annotation.type === 'file_citation') {
        const file = await openai.files.retrieve(
          annotation.file_citation.file_id
        );
        const fileName = file.filename;
        const fileTitle = fileName.replace('.md', '');
        const fileUrl = vueDocsIndex.find(
          (docMeta) => docMeta.title === fileTitle
        )?.url;
        if (!fileUrl) continue;
        assistantResponse = assistantResponse.replace(
          annotation.text,
          ` <a href="${fileUrl}" target="_blank">[${fileTitle}]</a>`
        );
      }
    }
  }

  return assistantResponse;
});
