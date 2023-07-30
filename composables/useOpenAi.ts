import { Configuration, OpenAIApi } from "openai";

export async function useAskQuestion(input: string) {
  console.log(input);
  const { messages } = storeToRefs(useChatStore());
  const { addAssistantMessage } = useChatStore();

  if (!input || input == 'test') return;
  
  const runtimeConfig = useRuntimeConfig();
  const configuration = new Configuration({
      organization: runtimeConfig.public.openaiOrganization,
      apiKey: runtimeConfig.public.openaiApiKey,
  });
  
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages.value,
  });
  
  console.log(response.data);
  if (!response.data.choices[0].message?.content) return;
  addAssistantMessage(response.data.choices[0].message.content);
}