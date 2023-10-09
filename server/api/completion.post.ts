import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('completion request received: ', body);
  const data = {
    model: "gpt-3.5-turbo-16k",
    temperature: 0.4,
    ...body,
  };

  const runtimeConfig = useRuntimeConfig();

  const openai = new OpenAI({
    organization: runtimeConfig.openaiOrganization,
    apiKey: runtimeConfig.openaiApiKey,
  });

  const completion = await openai.chat.completions.create(data);

  if (completion.choices.length === 0) return;
  return completion.choices;
});