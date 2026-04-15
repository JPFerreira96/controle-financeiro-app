import type {
  AIAnalysisInput,
  AIAnalysisOutput,
  FinancialSituation,
  IAIProvider,
} from "../../domain/providers/ai-provider.js";

export class MockProviderAI implements IAIProvider {
  readonly name = "mock-provider-ai";

  async analyzeFinancialHealth(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
    const situation = this.resolveSituation(input);
    const sortedCategories = [...input.categorySpending].sort((a, b) => b.total - a.total);
    const totalExpense = input.monthlyExpense;

    const excessiveCategories =
      totalExpense > 0
        ? sortedCategories.filter((item) => item.total / totalExpense >= 0.25).map((item) => item.category)
        : [];

    const controlledCategories =
      totalExpense > 0
        ? sortedCategories.filter((item) => item.total > 0 && item.total / totalExpense <= 0.1).map((item) => item.category)
        : [];

    const suggestions = this.buildSuggestions(situation, input);

    return {
      situation,
      excessiveCategories,
      controlledCategories,
      suggestions,
      monthlySummary: this.buildSummary(situation, input),
    };
  }

  private resolveSituation(input: AIAnalysisInput): FinancialSituation {
    if (input.monthlyIncome <= 0 && input.monthlyExpense > 0) {
      return "CRITICO";
    }
    if (input.expenseRatio >= 1) {
      return "CRITICO";
    }
    if (input.expenseRatio >= 0.8) {
      return "ATENCAO";
    }
    if (input.expenseRatio >= 0.55) {
      return "BOM";
    }
    return "OTIMO";
  }

  private buildSuggestions(situation: FinancialSituation, input: AIAnalysisInput): string[] {
    const topCategories = [...input.categorySpending]
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map((item) => item.category);

    if (situation === "CRITICO") {
      return [
        "Revise imediatamente os maiores gastos e defina teto semanal para as categorias mais caras.",
        "Priorize despesas essenciais e pause gastos discricionarios por 30 dias.",
        `Foque em reduzir principalmente: ${topCategories.join(", ")}.`,
      ];
    }
    if (situation === "ATENCAO") {
      return [
        "Ajuste seu limite de gastos nas categorias com maior peso no mes.",
        "Crie uma reserva de seguranca antes de aumentar despesas opcionais.",
        `Monitore semanalmente: ${topCategories.join(", ")}.`,
      ];
    }
    if (situation === "BOM") {
      return [
        "Mantenha o controle atual e automatize uma parte do saldo para investimentos.",
        "Revise contratos e assinaturas para encontrar economias adicionais.",
        "Continue acompanhando os gastos por categoria toda semana.",
      ];
    }
    return [
      "Parabens pelo controle financeiro consistente.",
      "Direcione parte do saldo para reserva de emergencia e objetivos de longo prazo.",
      "Mantenha metas mensais por categoria para preservar esse desempenho.",
    ];
  }

  private buildSummary(situation: FinancialSituation, input: AIAnalysisInput): string {
    return [
      `Analise simulada (${String(input.month).padStart(2, "0")}/${input.year}):`,
      `receita de R$ ${input.monthlyIncome.toFixed(2)}, despesa de R$ ${input.monthlyExpense.toFixed(2)}`,
      `e saldo de R$ ${input.monthlyBalance.toFixed(2)}.`,
      `Situacao classificada como ${situation}.`,
    ].join(" ");
  }
}

