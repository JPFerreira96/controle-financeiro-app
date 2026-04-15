import type { Expense } from "../../domain/entities/expense.js";
import type { Income } from "../../domain/entities/income.js";
import type { User } from "../../domain/entities/user.js";

interface InMemoryStore {
  users: User[];
  incomes: Income[];
  expenses: Expense[];
}

export const inMemoryStore: InMemoryStore = {
  users: [],
  incomes: [],
  expenses: [],
};
