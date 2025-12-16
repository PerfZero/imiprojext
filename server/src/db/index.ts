import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";
import * as authSchema from "./auth-schema";

const databaseFile =
    process.env.DB_FILE_NAME ?? path.join(process.cwd(), "data", "app.db");

const sqlite = new Database(databaseFile);
sqlite.pragma("journal_mode = WAL");
// sqlite.exec(schemaSql);

export const db = drizzle(sqlite, { schema: { ...authSchema, ...schema } });
export type DbClient = typeof db;

export * from "./schema";
export * from "./auth-schema";
