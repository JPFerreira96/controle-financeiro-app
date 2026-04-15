"use client";

import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { apiRequest } from "@/lib/api";
import { clearAuthSession, getAuthenticatedUser, getToken } from "@/lib/auth-storage";
import { formatDate, toCurrency } from "@/lib/format";
import type { DashboardReport, Expense, ExpenseCategory, FinancialHealthAnalysis, Income } from "@/types/finance";

const CATEGORY_OPTIONS: Array<{ value: ExpenseCategory; label: string }> = [
  { value: "ALIMENTACAO", label: "Alimentacao" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "LAZER", label: "Lazer" },
  { value: "MORADIA", label: "Moradia" },
  { value: "SAUDE", label: "Saude" },
  { value: "EDUCACAO", label: "Educacao" },
  { value: "CONTAS", label: "Contas" },
  { value: "OUTROS", label: "Outros" },
];

const CHART_COLORS = ["#e07a44", "#142032", "#2d6a4f", "#d17a00", "#7d4f50", "#4f5d75", "#4aa7a2", "#8b5cf6"];

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardReport | null>(null);
  const [analysis, setAnalysis] = useState<FinancialHealthAnalysis | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<"income" | "expense" | null>(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDate, setIncomeDate] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("ALIMENTACAO");

  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const user = useMemo(() => getAuthenticatedUser(), []);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, index) => currentYear - 4 + index);
  }, []);

  const loadData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/auth");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = `?year=${year}&month=${month}`;
      const [dashboardData, analysisData, incomesData, expensesData] = await Promise.all([
        apiRequest<DashboardReport>(`/api/reports/dashboard${query}`, { token }),
        apiRequest<FinancialHealthAnalysis>(`/api/analysis/financial-health${query}`, { token }),
        apiRequest<Income[]>("/api/incomes", { token }),
        apiRequest<Expense[]>("/api/expenses", { token }),
      ]);

      setDashboard(dashboardData);
      setAnalysis(analysisData);
      setIncomes(incomesData);
      setExpenses(expensesData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  }, [month, router, year]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreateIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/auth");
      return;
    }

    setBusyAction("income");
    setError(null);

    try {
      await apiRequest("/api/incomes", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: incomeTitle,
          amount: Number(incomeAmount),
          receivedAt: incomeDate || undefined,
        }),
      });

      setIncomeTitle("");
      setIncomeAmount("");
      setIncomeDate("");
      await loadData();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Falha ao cadastrar receita.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCreateExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/auth");
      return;
    }

    setBusyAction("expense");
    setError(null);

    try {
      await apiRequest("/api/expenses", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: expenseTitle,
          amount: Number(expenseAmount),
          category: expenseCategory,
          spentAt: expenseDate || undefined,
        }),
      });

      setExpenseTitle("");
      setExpenseAmount("");
      setExpenseDate("");
      setExpenseCategory("ALIMENTACAO");
      await loadData();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Falha ao cadastrar despesa.");
    } finally {
      setBusyAction(null);
    }
  }

  function logout() {
    clearAuthSession();
    router.push("/auth");
  }

  function startEditIncome(income: Income) {
    setEditingIncome(income);
    setIncomeTitle(income.title);
    setIncomeAmount(String(income.amount));
    setIncomeDate(income.receivedAt ? income.receivedAt.slice(0, 10) : "");
  }

  function cancelEditIncome() {
    setEditingIncome(null);
    setIncomeTitle("");
    setIncomeAmount("");
    setIncomeDate("");
  }

  function startEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setExpenseTitle(expense.title);
    setExpenseAmount(String(expense.amount));
    setExpenseDate(expense.spentAt ? expense.spentAt.slice(0, 10) : "");
    setExpenseCategory(expense.category);
  }

  function cancelEditExpense() {
    setEditingExpense(null);
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseDate("");
    setExpenseCategory("ALIMENTACAO");
  }

  async function handleUpdateIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingIncome) return;
    const token = getToken();
    if (!token) { router.push("/auth"); return; }

    setBusyAction("income");
    setError(null);

    try {
      await apiRequest(`/api/incomes/${editingIncome.id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          title: incomeTitle,
          amount: Number(incomeAmount),
          receivedAt: incomeDate || undefined,
        }),
      });
      cancelEditIncome();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao atualizar receita.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDeleteIncome(id: string) {
    const token = getToken();
    if (!token) { router.push("/auth"); return; }

    if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

    setError(null);
    try {
      await apiRequest(`/api/incomes/${id}`, { method: "DELETE", token });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir receita.");
    }
  }

  async function handleUpdateExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingExpense) return;
    const token = getToken();
    if (!token) { router.push("/auth"); return; }

    setBusyAction("expense");
    setError(null);

    try {
      await apiRequest(`/api/expenses/${editingExpense.id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          title: expenseTitle,
          amount: Number(expenseAmount),
          category: expenseCategory,
          spentAt: expenseDate || undefined,
        }),
      });
      cancelEditExpense();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao atualizar despesa.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDeleteExpense(id: string) {
    const token = getToken();
    if (!token) { router.push("/auth"); return; }

    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;

    setError(null);
    try {
      await apiRequest(`/api/expenses/${id}`, { method: "DELETE", token });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir despesa.");
    }
  }

  const situationClassName = useMemo(() => {
    switch (analysis?.situation) {
      case "CRITICO":
        return "status-critical";
      case "ATENCAO":
        return "status-warning";
      case "BOM":
        return "status-good";
      case "OTIMO":
        return "status-great";
      default:
        return "";
    }
  }, [analysis?.situation]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center p-6">
        <div className="card p-8 text-sm text-[#142032]">Carregando dashboard financeiro...</div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
        <div className="card p-8">
          <p className="text-[#c44536]">{error ?? "Nao foi possivel carregar os dados."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#5a2f14]">Dashboard financeiro</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#142032]">Ola, {user?.name ?? "usuario"}.</h1>
          <p className="text-muted text-sm">Acompanhe sua saude financeira em tempo real.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="text-sm">
            Ano
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="ml-2 rounded-lg border border-[#142032]/20 bg-white px-3 py-2"
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Mes
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="ml-2 rounded-lg border border-[#142032]/20 bg-white px-3 py-2"
            >
              {Array.from({ length: 12 }, (_, index) => index + 1).map((option) => (
                <option key={option} value={option}>
                  {String(option).padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void loadData()}
            className="rounded-lg bg-[#142032] px-4 py-2 text-sm font-semibold text-white"
          >
            Atualizar
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[#142032]/20 px-4 py-2 text-sm font-semibold text-[#142032]"
          >
            Sair
          </button>
        </div>
      </header>

      {error ? <div className="card border border-[#c44536]/20 p-4 text-sm text-[#c44536]">{error}</div> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Saldo atual" value={toCurrency(dashboard.currentBalance)} />
        <MetricCard label="Receitas totais" value={toCurrency(dashboard.totalIncome)} />
        <MetricCard label="Despesas totais" value={toCurrency(dashboard.totalExpense)} />
        <MetricCard label="Saldo mensal" value={toCurrency(dashboard.monthlyBalance)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#142032]">Analise financeira com IA</h2>
          <p className={`mt-3 text-sm font-semibold ${situationClassName}`}>
            Classificacao: {analysis?.situation ?? "NAO DISPONIVEL"}
          </p>
          <p className="text-muted mt-2 text-sm">{analysis?.monthlySummary ?? "Sem resumo para o periodo."}</p>
          <p className="text-muted mt-2 text-xs">Provider ativo: {analysis?.provider ?? "mock-provider-ai"}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[#142032]">Categorias com gasto alto</h3>
              <ul className="mt-2 grid gap-1 text-sm text-[#1c3149]">
                {analysis?.excessiveCategories?.length ? (
                  analysis.excessiveCategories.map((category) => <li key={category}>- {category}</li>)
                ) : (
                  <li>- Nenhuma categoria critica.</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#142032]">Categorias controladas</h3>
              <ul className="mt-2 grid gap-1 text-sm text-[#1c3149]">
                {analysis?.controlledCategories?.length ? (
                  analysis.controlledCategories.map((category) => <li key={category}>- {category}</li>)
                ) : (
                  <li>- Nenhuma categoria destacada.</li>
                )}
              </ul>
            </div>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[#142032]">Sugestoes de melhoria</h3>
          <ul className="mt-2 grid gap-1 text-sm text-[#1c3149]">
            {analysis?.suggestions?.length ? (
              analysis.suggestions.map((suggestion) => <li key={suggestion}>- {suggestion}</li>)
            ) : (
              <li>- Sem sugestoes para este periodo.</li>
            )}
          </ul>
        </article>

        <article className="card p-6">
          <h2 className="text-lg font-semibold text-[#142032]">Resumos</h2>
          <p className="text-muted mt-3 text-sm">{dashboard.summaries.monthly}</p>
          <p className="text-muted mt-3 text-sm">{dashboard.summaries.annual}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card p-6">
          <h2 className="text-lg font-semibold text-[#142032]">
            {editingIncome ? "Editar receita" : "Cadastrar receita"}
          </h2>
          <form onSubmit={editingIncome ? handleUpdateIncome : handleCreateIncome} className="mt-4 grid gap-3">
            <input
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 text-sm"
              placeholder="Descricao da receita"
              value={incomeTitle}
              onChange={(event) => setIncomeTitle(event.target.value)}
              required
            />
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 text-sm"
              placeholder="Valor"
              value={incomeAmount}
              onChange={(event) => setIncomeAmount(event.target.value)}
              required
            />
            <input
              type="date"
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 text-sm"
              value={incomeDate}
              onChange={(event) => setIncomeDate(event.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#1e9150] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={busyAction === "income"}
              >
                {busyAction === "income" ? "Salvando..." : editingIncome ? "Atualizar receita" : "Salvar receita"}
              </button>
              {editingIncome && (
                <button
                  type="button"
                  onClick={cancelEditIncome}
                  className="rounded-lg border border-[#142032]/20 px-4 py-2 text-sm font-semibold text-[#142032]"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="card p-6">
          <h2 className="text-lg font-semibold text-[#142032]">
            {editingExpense ? "Editar despesa" : "Cadastrar despesa"}
          </h2>
          <form onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense} className="mt-4 grid gap-3">
            <input
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 text-sm"
              placeholder="Descricao da despesa"
              value={expenseTitle}
              onChange={(event) => setExpenseTitle(event.target.value)}
              required
            />
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 text-sm"
              placeholder="Valor"
              value={expenseAmount}
              onChange={(event) => setExpenseAmount(event.target.value)}
              required
            />
            <select
              value={expenseCategory}
              onChange={(event) => setExpenseCategory(event.target.value as ExpenseCategory)}
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 text-sm"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 text-sm"
              value={expenseDate}
              onChange={(event) => setExpenseDate(event.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#c44536] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={busyAction === "expense"}
              >
                {busyAction === "expense" ? "Salvando..." : editingExpense ? "Atualizar despesa" : "Salvar despesa"}
              </button>
              {editingExpense && (
                <button
                  type="button"
                  onClick={cancelEditExpense}
                  className="rounded-lg border border-[#142032]/20 px-4 py-2 text-sm font-semibold text-[#142032]"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Gastos semanais">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboard.charts.weeklyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#e07a44" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gastos mensais">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dashboard.charts.monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#142032" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gastos anuais">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboard.charts.yearlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2d6a4f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gastos por categoria">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={dashboard.charts.categoryExpenses}
                dataKey="total"
                nameKey="label"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
              >
                {dashboard.charts.categoryExpenses.map((entry, index) => (
                  <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Receitas x despesas (mensal)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboard.charts.incomeVsExpense}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#1e9150" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#c44536" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Evolucao do saldo">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dashboard.charts.balanceEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="balance" stroke="#e07a44" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card p-6">
          <h2 className="text-lg font-semibold text-[#142032]">Ultimas receitas</h2>
          <div className="mt-3 max-h-72 space-y-2 overflow-auto pr-1">
            {incomes.length ? (
              incomes.slice(0, 10).map((income) => (
                <div key={income.id} className="flex items-center justify-between rounded-lg border border-[#142032]/10 px-3 py-2 text-sm">
                  <div>
                    <p className="font-semibold">{income.title}</p>
                    <p className="text-muted">{formatDate(income.receivedAt)}</p>
                    <p className="text-[#1e9150]">{toCurrency(income.amount)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEditIncome(income)}
                      className="rounded px-2 py-1 text-xs font-semibold text-[#142032] hover:bg-[#142032]/10"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteIncome(income.id)}
                      className="rounded px-2 py-1 text-xs font-semibold text-[#c44536] hover:bg-[#c44536]/10"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm">Nenhuma receita cadastrada.</p>
            )}
          </div>
        </article>

        <article className="card p-6">
          <h2 className="text-lg font-semibold text-[#142032]">Ultimas despesas</h2>
          <div className="mt-3 max-h-72 space-y-2 overflow-auto pr-1">
            {expenses.length ? (
              expenses.slice(0, 10).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between rounded-lg border border-[#142032]/10 px-3 py-2 text-sm">
                  <div>
                    <p className="font-semibold">{expense.title}</p>
                    <p className="text-muted">
                      {formatDate(expense.spentAt)} | {expense.category}
                    </p>
                    <p className="text-[#c44536]">{toCurrency(expense.amount)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEditExpense(expense)}
                      className="rounded px-2 py-1 text-xs font-semibold text-[#142032] hover:bg-[#142032]/10"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteExpense(expense.id)}
                      className="rounded px-2 py-1 text-xs font-semibold text-[#c44536] hover:bg-[#c44536]/10"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm">Nenhuma despesa cadastrada.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="card p-4">
      <p className="text-muted text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#142032]">{value}</p>
    </article>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="card p-4">
      <h2 className="mb-3 text-base font-semibold text-[#142032]">{title}</h2>
      {children}
    </article>
  );
}
