import { BaseLLM } from 'llamaindex/llm/base';
import { CohereClient } from 'cohere-ai';
import type { ChatRequest } from 'cohere-ai/api';
import type {
  ChatMessage,
  ChatResponse,
  ChatResponseChunk,
  LLMChatParamsNonStreaming,
  LLMChatParamsStreaming,
} from 'llamaindex';

export const ALL_AVAILABLE_COHERE_MODELS = {
  'command-r-plus': { contextWindow: 128000 },
  'command-r': { contextWindow: 128000 },
};

export class CohereSession {
  apiKey?: string;
  private client?: CohereClient;

  constructor(init?: Partial<CohereSession>) {
    if (!init?.apiKey) {
      throw new Error('Set Cohere API key');
    }
    this.apiKey = init.apiKey;
  }

  async getClient() {
    if (!this.client) {
      this.client = new CohereClient({
        token: this.apiKey,
      });
    }
    return this.client;
  }
}

/**
 * Cohere LLM implementation
 */
export class CohereLLM extends BaseLLM {
  // Per completion MistralAI params
  model: keyof typeof ALL_AVAILABLE_COHERE_MODELS;
  temperature: number;
  topP: number;
  maxTokens?: number;
  apiKey?: string;
  safeMode: boolean;
  randomSeed?: number;

  private session: CohereSession;

  constructor(init?: Partial<CohereLLM>) {
    super();
    this.model = init?.model ?? 'command-r-plus';
    this.temperature = init?.temperature ?? 0.1;
    this.topP = init?.topP ?? 1;
    this.maxTokens = init?.maxTokens ?? undefined;
    this.safeMode = init?.safeMode ?? false;
    this.randomSeed = init?.randomSeed ?? undefined;
    this.session = new CohereSession(init);
  }

  get metadata() {
    return {
      model: this.model,
      temperature: this.temperature,
      topP: this.topP,
      maxTokens: this.maxTokens,
      contextWindow: ALL_AVAILABLE_COHERE_MODELS[this.model].contextWindow,
      tokenizer: undefined,
    };
  }

  private buildParams(messages: ChatMessage[]): ChatRequest {
    return {
      message: messages[0].content as string,
    };
  }

  chat(
    params: LLMChatParamsStreaming
  ): Promise<AsyncIterable<ChatResponseChunk>>;
  chat(params: LLMChatParamsNonStreaming): Promise<ChatResponse>;
  async chat(
    params: LLMChatParamsNonStreaming | LLMChatParamsStreaming
  ): Promise<ChatResponse | AsyncIterable<ChatResponseChunk>> {
    const { messages } = params;
    // Non-streaming
    const client = await this.session.getClient();
    const response = await client.chat(this.buildParams(messages));
    const message = {
      content: response.text,
      role: 'assistant' as const,
    };
    return {
      raw: response,
      message,
    };
  }
}
