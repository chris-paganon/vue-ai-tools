import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  
  const body = await readBody(event)
  console.log('docCompletion request received: ', body);
  if (!body.path || !body.messages) {
    console.log('Missing path or messages');
    return;
  } 

  const relevantDocPage: string = await $fetch(`https://vue-docs.nyc3.cdn.digitaloceanspaces.com/${body.path}`);
  const messages = body.messages.map((message: OpenAI.Chat.ChatCompletionMessage) => {
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