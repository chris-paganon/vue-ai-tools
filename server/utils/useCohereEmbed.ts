import { BaseEmbedding, type MessageContentTextDetail } from 'llamaindex';
import type { EmbedFloatsResponse } from 'cohere-ai/api';
import { CohereSession } from './useCohereLLM';

export enum CohereEmbeddingModelType {
  COHERE_EMBED_V2 = 'embed-multilingual-v2.0',
  COHERE_EMBED_EN_V3 = 'embed-english-v3.0',
}

export class CohereEmbedding extends BaseEmbedding {
  model: CohereEmbeddingModelType;
  apiKey?: string;

  private session: CohereSession;

  constructor(init?: Partial<CohereEmbedding>) {
    super();
    this.model = CohereEmbeddingModelType.COHERE_EMBED_EN_V3;
    this.session = new CohereSession(init);
  }

  async getQueryEmbedding(input: MessageContentTextDetail) {
    const client = await this.session.getClient();
    const response = (await client.embed({
      model: this.model,
      texts: [input.text],
      inputType: 'search_query',
    })) as EmbedFloatsResponse;

    return response.embeddings[0];
  }

  async getTextEmbedding(text: string): Promise<number[]> {
    return this.getQueryEmbedding({ type: 'text', text });
  }
}
