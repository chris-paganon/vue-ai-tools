import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const messages = body.messages;

  const answer = JSON.stringify(event.context);

  // const { cloudflare } = event.context.cloudflare
  // const configuration = new Configuration({
  //   organization: cloudflare.env.OPENAI_ORGANIZATION,
  //   apiKey: cloudflare.env.OPENAI_API_KEY,
  // });
  
  // const openai = new OpenAIApi(configuration);
  // const response = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: messages,
  // });

  // if (!response.data.choices[0].message?.content) return;
  // const answer = JSON.stringify(response.data.choices[0].message.content);

  return answer;
});