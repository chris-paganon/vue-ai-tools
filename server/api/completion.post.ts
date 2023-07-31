export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const messages = body.messages;
  const data = {
    model: "gpt-3.5-turbo",
    messages: messages,
  };

  const { cloudflare } = event.context;
  const responseJson = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cloudflare.env.OPENAI_API_KEY}`,
      'Openai-Organization': cloudflare.env.OPENAI_ORGANIZATION
    },
    body: JSON.stringify(data),
  });
  const response = await responseJson.json();

  if (!response.choices[0].message?.content) return;
  const answer = response.choices[0].message.content;

  return answer;
});