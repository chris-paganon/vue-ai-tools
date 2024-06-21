import { OpenAI } from 'llamaindex';

export class DeepseekLLM extends OpenAI {
  constructor(init?: Partial<OpenAI>) {
    const {
      apiKey = '',
      additionalSessionOptions = {},
      model = 'deepseek-coder',
      ...rest
    } = init ?? {};

    if (!apiKey) {
      throw new Error('Set Deepseek Key in DEEPSEEK_API_KEY env variable'); // Tell user to set correct env variable, and not OPENAI_API_KEY
    }

    additionalSessionOptions.baseURL =
      additionalSessionOptions.baseURL ?? 'https://api.deepseek.com/v1';

    super({
      apiKey,
      additionalSessionOptions,
      model,
      ...rest,
    });
  }
}
