import OpenAI from "openai";
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

export class OpenAIProviderAI implements IAIProvider {
  readonly name = "openai-provider-ai";

  private readonly client: OpenAI;
  private readonly promptService: AIAnalysisPromptService;
  private readonly model: string;

  constructor(apiKey: string, model: string, promptService = new AIAnalysisPromptService()) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.promptService = promptService;
  }

  async analyzeFinancialHealth(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            "Voce eh um analista financeiro. Retorne somente JSON valido no formato solicitado, sem markdown.",
        },
        {
          role: "user",
          content: this.promptService.buildPrompt(input),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "{}";
    const parsed = responseSchema.parse(JSON.parse(rawContent));

    return parsed;
  }
}

