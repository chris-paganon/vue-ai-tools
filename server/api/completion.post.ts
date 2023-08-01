export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const messages = body.messages;
  const data = {
    model: "gpt-3.5-turbo",
    temperature: 1,
    messages: messages,
  };

  let openaiKey = '';
  let openaiOrganization = '';
  if (event.context.cloudflare) {
    const { cloudflare } = event.context;
    openaiKey = cloudflare.env.OPENAI_API_KEY;
    openaiOrganization = cloudflare.env.OPENAI_ORGANIZATION;
  } else {
    const runtimeConfig = useRuntimeConfig();
    openaiKey = runtimeConfig.public.openaiApiKey;
    openaiOrganization = runtimeConfig.public.openaiOrganization;
  }
  
  const responseJson = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
      'Openai-Organization': openaiOrganization,
    },
    body: JSON.stringify(data),
  });
  const response = await responseJson.json();

  if (!response.choices[0].message?.content) return;
  const answer = response.choices[0].message.content;

  return answer;
});