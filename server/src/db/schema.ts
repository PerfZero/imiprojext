import { sql } from "drizzle-orm";
import {
    integer,
    real,
    sqliteTable,
    text,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user as users } from "./auth-schema";

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

export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: integer("created_at")
        .notNull()
        .default(sql`(strftime('%s','now'))`),
});

export const products = sqliteTable("products", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    price: real("price").notNull(),
    currency: text("currency").notNull().default("RUB"),
    image: text("image"),
    categoryId: integer("category_id").references(() => categories.id),
    discount: real("discount").default(0),
    discountType: text("discount_type").default("percentage"),
    stock: integer("stock").default(0),
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    createdAt: integer("created_at")
        .notNull()
        .default(sql`(strftime('%s','now'))`),
});

export const attributes = sqliteTable("attributes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    type: text("type").notNull().default("text"),
});

export const attributeValues = sqliteTable("attribute_values", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    attributeId: integer("attribute_id")
        .notNull()
        .references(() => attributes.id),
    value: text("value").notNull(),
    extra: text("extra"),
});

export const productVariants = sqliteTable("product_variants", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id")
        .notNull()
        .references(() => products.id),
    sku: text("sku"),
    price: real("price"),
    stock: integer("stock").default(0),
    image: text("image"),
});

export const productVariantAttributes = sqliteTable(
    "product_variant_attributes",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        variantId: integer("variant_id")
            .notNull()
            .references(() => productVariants.id),
        attributeValueId: integer("attribute_value_id")
            .notNull()
            .references(() => attributeValues.id),
    },
    (table) => ({
        variantAttrIdx: uniqueIndex("variant_attr_idx").on(
            table.variantId,
            table.attributeValueId
        ),
    })
);

export const productAttributes = sqliteTable(
    "product_attributes",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        productId: integer("product_id")
            .notNull()
            .references(() => products.id),
        attributeValueId: integer("attribute_value_id")
            .notNull()
            .references(() => attributeValues.id),
    },
    (table) => ({
        productAttrIdx: uniqueIndex("product_attr_idx").on(
            table.productId,
            table.attributeValueId
        ),
    })
);

export const productImages = sqliteTable("product_images", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id")
        .notNull()
        .references(() => products.id),
    url: text("url").notNull(),
    isMain: integer("is_main", { mode: "boolean" }).default(false).notNull(),
    sortOrder: integer("sort_order").default(0),
});

export type WalletBalance = typeof walletBalances.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Attribute = typeof attributes.$inferSelect;
export type AttributeValue = typeof attributeValues.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type ProductVariantAttribute = typeof productVariantAttributes.$inferSelect;
