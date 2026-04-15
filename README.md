# Controle Financeiro App

Sistema financeiro pessoal full-stack com:

- Frontend em Next.js (React)
- Backend em Node.js + Fastify
- Banco preparado para PostgreSQL ou MySQL (Prisma)
- Graficos no dashboard com Recharts
- Analise financeira com IA (OpenAI/Gemini) com fallback automatico para `MockProviderAI`
- Backend organizado em Clean Architecture

## Estrutura

```txt
.
├── backend
│   └── src
│       ├── domain
│       ├── application
│       ├── infrastructure
│       ├── interfaces
│       ├── config
│       └── shared
└── frontend
    └── src
        └── app
            ├── auth
            └── dashboard
```

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL ou MySQL rodando localmente

## Modo Mock (sem banco e sem IA externa)

Se quiser rodar sem depender de banco e sem chamadas reais de IA:

1. No `backend/.env`, defina:
```bash
USE_MOCK_MODE=true
```

2. Suba apenas backend e frontend:
```bash
cd backend
npm run dev

cd ../frontend
npm run dev
```

Com isso, os dados ficam em memoria (temporarios) e a analise usa `MockProviderAI`.

## Backend

1. Configure variaveis:
```bash
cd backend
cp .env.example .env
```

2. Ajuste o banco no `.env`:
- `DATABASE_PROVIDER=postgresql` ou `mysql`
- `DATABASE_URL=...`

3. Gere cliente Prisma e rode migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Rode API:
```bash
npm run dev
```

API padrao: `http://localhost:3333`

## Frontend

1. Configure variaveis:
```bash
cd frontend
cp .env.example .env.local
```

2. Rode app:
```bash
npm run dev
```

Frontend padrao: `http://localhost:3000`

## IA e Fallback

No backend, a aplicacao tenta os providers nesta ordem:

1. `API_KEY_OPENAI`
2. `API_KEY_GEMINI`
3. `API_KEY_AI` + `AI_PROVIDER`
4. Se nenhuma key existir, usa `MockProviderAI` automaticamente

## Endpoints principais

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/incomes`
- `GET /api/incomes`
- `POST /api/expenses`
- `GET /api/expenses`
- `GET /api/reports/dashboard`
- `GET /api/reports/charts`
- `GET /api/reports/monthly-summary`
- `GET /api/reports/annual-summary`
- `GET /api/analysis/financial-health`
