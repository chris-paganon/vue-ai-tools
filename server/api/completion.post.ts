import OpenAI from "openai";
import { useCreateConversation } from "@/server/utils/usePbConversations";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('completion request received');
  const data = {
    model: "gpt-3.5-turbo-16k",
    temperature: 0.4,
    ...body,
  };

  useCreateConversation(event, body.conversationId, body.messages);

  const runtimeConfig = useRuntimeConfig();

  const openai = new OpenAI({
    organization: runtimeConfig.openaiOrganization,
    apiKey: runtimeConfig.openaiApiKey,
  });

  try {
    const completion = await openai.chat.completions.create(data);
    if (completion.choices.length === 0) return;
    return completion.choices;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.log('error: ', error.error); // Error info
      console.log('status: ', error.status); // 400
      console.log('error name: ', error.name); // BadRequestError
      console.log('error headers: ', error.headers); // {server: 'nginx', ...}
    } else {
      console.log(error);
    }
    return;
  }
});