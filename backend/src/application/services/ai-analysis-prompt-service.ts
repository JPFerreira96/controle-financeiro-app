import type { AIAnalysisInput } from "../../domain/providers/ai-provider.js";

export class AIAnalysisPromptService {
  buildPrompt(input: AIAnalysisInput): string {
    const categoryLines = input.categorySpending
      .map((item) => `- ${item.category}: R$ ${item.total.toFixed(2)}`)
      .join("\n");

    return [
      "Voce eh um analista financeiro pessoal.",
      "Responda SOMENTE em JSON com o formato:",
      '{ "situation": "CRITICO|ATENCAO|BOM|OTIMO", "excessiveCategories": ["..."], "controlledCategories": ["..."], "suggestions": ["..."], "monthlySummary": "..." }',
      "",
      `Periodo analisado: ${String(input.month).padStart(2, "0")}/${input.year}`,
      `Receita mensal: R$ ${input.monthlyIncome.toFixed(2)}`,
      `Despesa mensal: R$ ${input.monthlyExpense.toFixed(2)}`,
      `Saldo mensal: R$ ${input.monthlyBalance.toFixed(2)}`,
      `Indice despesa/receita: ${(input.expenseRatio * 100).toFixed(2)}%`,
      "Gastos por categoria:",
      categoryLines,
      "",
      "Regras:",
      "1) Identifique categorias com gasto excessivo e categorias controladas.",
      "2) Classifique a situacao financeira.",
      "3) Diga sugestoes praticas e objetivas para reduzir custos.",
      "4) Gere um resumo mensal claro e curto em portugues do Brasil.",
    ].join("\n");
  }
}

