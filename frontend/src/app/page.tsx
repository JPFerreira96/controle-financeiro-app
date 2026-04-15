import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-14 lg:px-10">
      <main className="card grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
        <section className="flex flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#5a2f14]">Finance OS</p>
          <h1 className="text-4xl font-semibold leading-tight text-[#142032] lg:text-5xl">
            Controle financeiro pessoal com graficos, relatorios e analise por IA.
          </h1>
          <p className="text-muted max-w-xl">
            Registre receitas e despesas, acompanhe o saldo, identifique gastos excessivos e receba recomendacoes
            automaticas para melhorar sua saude financeira.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/auth"
              className="rounded-xl bg-[#e07a44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c86633]"
            >
              Entrar no sistema
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-[#142032]/20 bg-white px-5 py-3 text-sm font-semibold text-[#142032] transition hover:border-[#142032]/40"
            >
              Ver dashboard
            </Link>
          </div>
        </section>

        <section className="card bg-[var(--surface-strong)] p-6">
          <h2 className="mb-4 text-lg font-semibold">Funcionalidades principais</h2>
          <ul className="grid gap-2 text-sm text-[#1c3149]">
            <li>Cadastro e autenticacao de usuario</li>
            <li>Gestao de receitas e despesas por categoria</li>
            <li>Graficos semanais, mensais, anuais e por categoria</li>
            <li>Comparativo receitas x despesas e evolucao de saldo</li>
            <li>Resumo mensal/anual com classificacao financeira por IA</li>
            <li>Fallback automatico para MockProviderAI sem API key</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
