import { join } from "path";
import { POSTGRES_URL } from "./enviroments.config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [join(__dirname, '../db/schemas/*{.ts,.js}')],
  out: '../db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: POSTGRES_URL!,
  },
});