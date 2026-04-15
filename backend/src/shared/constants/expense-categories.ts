export const EXPENSE_CATEGORIES = [
  "ALIMENTACAO",
  "TRANSPORTE",
  "LAZER",
  "MORADIA",
  "SAUDE",
  "EDUCACAO",
  "CONTAS",
  "OUTROS",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  ALIMENTACAO: "Alimentacao",
  TRANSPORTE: "Transporte",
  LAZER: "Lazer",
  MORADIA: "Moradia",
  SAUDE: "Saude",
  EDUCACAO: "Educacao",
  CONTAS: "Contas",
  OUTROS: "Outros",
};

