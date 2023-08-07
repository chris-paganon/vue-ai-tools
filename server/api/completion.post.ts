export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = {
    model: "gpt-3.5-turbo-16k",
    temperature: 0.4,
    ...body,
  };

  const runtimeConfig = useRuntimeConfig();
  const openaiKey = runtimeConfig.openaiApiKey;
  const openaiOrganization = runtimeConfig.openaiOrganization;
  
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

  if (response.choices.length === 0) {
    return new Response('No choices found', { status: 500 });
  }
  return response.choices;
});