import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3333),
  JWT_SECRET: z.string().min(8),
  USE_MOCK_MODE: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  DATABASE_PROVIDER: z.enum(["postgresql", "mysql"]).default("postgresql"),
  DATABASE_URL: z.string().min(1),
  API_KEY_OPENAI: z.string().optional(),
  API_KEY_GEMINI: z.string().optional(),
  API_KEY_AI: z.string().optional(),
  AI_PROVIDER: z.enum(["openai", "gemini"]).default("openai"),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(parsedEnv.error.format(), null, 2)}`,
  );
}

export const env = parsedEnv.data;
