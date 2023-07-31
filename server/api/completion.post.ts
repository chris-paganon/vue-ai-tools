import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const messages = body.messages;

  const { cloudflare } = event.context;
  console.log(cloudflare);
  
  const configuration = new Configuration({
    organization: cloudflare.env.OPENAI_ORGANIZATION,
    apiKey: cloudflare.env.OPENAI_API_KEY,
  });
  
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  const answer = JSON.stringify(response);

  // if (!response.data.choices[0].message?.content) return;
  // const answer = JSON.stringify(response.data.choices[0].message.content);

  return answer;
});