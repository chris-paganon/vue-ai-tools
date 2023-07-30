import { Configuration, OpenAIApi } from "openai";

export async function useAskQuestion(input: string) {
  console.log(input);
  if (!input || input == 'test') return;
  const runtimeConfig = useRuntimeConfig();

  const configuration = new Configuration({
      organization: runtimeConfig.public.openaiOrganization,
      apiKey: runtimeConfig.public.openaiApiKey,
  });
  
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: input
      }
    ],
  });
  
  console.log(response.data.choices[0].message?.content);
}