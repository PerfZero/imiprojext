import "dotenv/config";
import path from "node:path";
import Database from "better-sqlite3";
import { readFileSync } from "fs";

const databaseFile =
    process.env.DB_FILE_NAME ?? path.join(process.cwd(), "data", "app.db");

const migrationFile = path.join(process.cwd(), "drizzle", "0002_add_discount_type.sql");

console.log("Подключение к БД:", databaseFile);
const sqlite = new Database(databaseFile);

console.log("Чтение миграции:", migrationFile);
const migrationSQL = readFileSync(migrationFile, "utf-8");

const statements = migrationSQL
    .split("--> statement-breakpoint")
    .map(s => s.trim())
    .filter(s => s && !s.startsWith("--"));

console.log(`Применение ${statements.length} SQL команд...`);

sqlite.transaction(() => {
    for (const statement of statements) {
        if (statement) {
            console.log("Выполнение:", statement.substring(0, 50) + "...");
            sqlite.exec(statement);
        }
    }
})();

console.log("Миграция успешно применена!");
sqlite.close();
