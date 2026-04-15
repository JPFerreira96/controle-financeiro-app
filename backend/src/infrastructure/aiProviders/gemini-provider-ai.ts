import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type { AIAnalysisInput, AIAnalysisOutput, IAIProvider } from "../../domain/providers/ai-provider.js";
import { AIAnalysisPromptService } from "../../application/services/ai-analysis-prompt-service.js";

const responseSchema = z.object({
  situation: z.enum(["CRITICO", "ATENCAO", "BOM", "OTIMO"]),
  excessiveCategories: z.array(z.string()).default([]),
  controlledCategories: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
  monthlySummary: z.string().min(1),
});

export class GeminiProviderAI implements IAIProvider {
  readonly name = "gemini-provider-ai";

  private readonly client: GoogleGenAI;
  private readonly model: string;
  private readonly promptService: AIAnalysisPromptService;

  constructor(apiKey: string, model: string, promptService = new AIAnalysisPromptService()) {
    this.client = new GoogleGenAI({ apiKey });
    this.model = model;
    this.promptService = promptService;
  }

  async analyzeFinancialHealth(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: this.promptService.buildPrompt(input),
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const parsed = responseSchema.parse(JSON.parse(response.text ?? "{}"));
    return parsed;
  }
}

