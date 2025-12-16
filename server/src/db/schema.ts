import { sql } from "drizzle-orm";
import {
    integer,
    real,
    sqliteTable,
    text,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user as users } from "./auth-schema";

const nowTimestamp = sql`(strftime('%s','now') * 1000)`;

export const walletBalances = sqliteTable(
    "wallet_balances",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        userId: text("user_id")
            .notNull()
            .references(() => users.id),
        currency: text("currency").notNull(),
        balance: real("balance").notNull().default(0),
        updatedAt: integer("updated_at")
            .notNull()
            .default(sql`(strftime('%s','now'))`),
    },
    (table) => ({
        userCurrencyIdx: uniqueIndex("wallet_user_currency_idx").on(
            table.userId,
            table.currency
        ),
    })
);

export const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    currency: text("currency").notNull(),
    amount: real("amount").notNull(),
    type: text("type").notNull(),
    metadata: text("metadata"),
    createdAt: integer("created_at")
        .notNull()
        .default(sql`(strftime('%s','now'))`),
});

export const notifications = sqliteTable("notifications", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").references(() => users.id),
    category: text("category").notNull(),
    subcategory: text("subcategory").notNull(),
    message: text("message").notNull(),
    data: text("data"),
    createdAt: integer("created_at")
        .notNull()
        .default(sql`(strftime('%s','now'))`),
    is_read: integer("is_read", { mode: "boolean" }).default(false).notNull(),
});

// export type User = typeof users.$inferSelect;
export type WalletBalance = typeof walletBalances.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
