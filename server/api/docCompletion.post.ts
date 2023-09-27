import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

export default defineEventHandler(async (event) => {
  
  const body = await readBody(event)
  console.log('docCompletion request received: ', body);
  if (!body.path || !body.messages) {
    console.log('Missing path or messages');
    return;
  } 

  const relevantDocPage: string = await $fetch(`https://vue-docs.nyc3.cdn.digitaloceanspaces.com/${body.path}`);
  const messages = body.messages.map((message: ChatCompletionRequestMessage) => {
    if (message.role === 'system' && message.content?.includes('{{VAI_DOC_PAGE}}')) {
      message.content = message.content.replace('{{VAI_DOC_PAGE}}', relevantDocPage);
    }
    return message;
  });
    
  const data = {
    model: "gpt-3.5-turbo-16k",
    temperature: 0.4,
    messages: messages,
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