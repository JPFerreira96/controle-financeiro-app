import { env } from "../../config/env.js";
import type { IAIProvider } from "../../domain/providers/ai-provider.js";
import { GeminiProviderAI } from "./gemini-provider-ai.js";
import { MockProviderAI } from "./mock-provider-ai.js";
import { OpenAIProviderAI } from "./openai-provider-ai.js";

interface AIProviderFactoryOutput {
  provider: IAIProvider;
  fallbackProvider: IAIProvider;
}

export const createAIProvider = (): AIProviderFactoryOutput => {
  const mock = new MockProviderAI();

  if (env.USE_MOCK_MODE) {
    return {
      provider: mock,
      fallbackProvider: mock,
    };
  }

  if (env.API_KEY_OPENAI) {
    return {
      provider: new OpenAIProviderAI(env.API_KEY_OPENAI, env.OPENAI_MODEL),
      fallbackProvider: mock,
    };
  }

  if (env.API_KEY_GEMINI) {
    return {
      provider: new GeminiProviderAI(env.API_KEY_GEMINI, env.GEMINI_MODEL),
      fallbackProvider: mock,
    };
  }

  if (env.API_KEY_AI) {
    if (env.AI_PROVIDER === "gemini") {
      return {
        provider: new GeminiProviderAI(env.API_KEY_AI, env.GEMINI_MODEL),
        fallbackProvider: mock,
      };
    }

    return {
      provider: new OpenAIProviderAI(env.API_KEY_AI, env.OPENAI_MODEL),
      fallbackProvider: mock,
    };
  }

  return {
    provider: mock,
    fallbackProvider: mock,
  };
};
