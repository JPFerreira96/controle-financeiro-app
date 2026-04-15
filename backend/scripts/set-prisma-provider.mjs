import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const provider = process.env.DATABASE_PROVIDER === "mysql" ? "mysql" : "postgresql";

const schema = fs.readFileSync(schemaPath, "utf8");
const updatedSchema = schema.replace(/provider\s*=\s*"(postgresql|mysql)"/, `provider = "${provider}"`);

if (schema !== updatedSchema) {
  fs.writeFileSync(schemaPath, updatedSchema, "utf8");
}

console.log(`Prisma datasource provider configurado para: ${provider}`);

