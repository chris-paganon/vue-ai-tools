import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = {
    model: "gpt-3.5-turbo-16k",
    temperature: 0.4,
    ...body,
  };

  const runtimeConfig = useRuntimeConfig();

  const configuration = new Configuration({
    organization: runtimeConfig.openaiOrganization,
    apiKey: runtimeConfig.openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion(data);

  if (completion.data.choices.length === 0) return;
  return completion.data.choices;
});