"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth-storage";
import type { AuthResponse } from "@/types/finance";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pageTitle = useMemo(() => (mode === "login" ? "Acessar conta" : "Criar conta"), [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      if (mode === "register") {
        await apiRequest<{ message: string }>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
      }

      const auth = await apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      saveAuthSession(auth.token, auth.user);
      setFeedback("Autenticacao concluida. Redirecionando para o dashboard...");
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-12">
      <div className="card w-full p-8 md:p-10">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#5a2f14]">Finance OS</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#142032]">{pageTitle}</h1>
            <p className="text-muted mt-2 text-sm">Use seu email para entrar e acompanhar sua vida financeira.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-[#142032] underline underline-offset-4">
            Voltar
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {mode === "register" ? (
            <label className="grid gap-1 text-sm">
              Nome
              <input
                className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 outline-none ring-[#e07a44] focus:ring-2"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
          ) : null}

          <label className="grid gap-1 text-sm">
            Email
            <input
              type="email"
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 outline-none ring-[#e07a44] focus:ring-2"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="grid gap-1 text-sm">
            Senha
            <input
              type="password"
              className="rounded-lg border border-[#142032]/20 bg-white px-3 py-2 outline-none ring-[#e07a44] focus:ring-2"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </label>

          {feedback ? <p className="text-sm text-[#1e9150]">{feedback}</p> : null}
          {error ? <p className="text-sm text-[#c44536]">{error}</p> : null}

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[#e07a44] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c86633] disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Processando..." : mode === "login" ? "Entrar" : "Cadastrar e entrar"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#142032]/10 pt-5 text-sm text-[#1b2f45]">
          {mode === "login" ? "Nao possui conta?" : "Ja possui conta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
              setFeedback(null);
            }}
            className="font-semibold underline underline-offset-4"
          >
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

