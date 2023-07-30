import { Configuration, OpenAIApi } from "openai";

export async function useAskQuestion() {
  const { messages } = storeToRefs(useChatStore());
  const { addAssistantMessage } = useChatStore();

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
  
  console.log('Open AI response:', response.data);
  if (!response.data.choices[0].message?.content) return;
  addAssistantMessage(response.data.choices[0].message.content);
}