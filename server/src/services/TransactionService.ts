import { eq, and, sql } from "drizzle-orm";
import { DbClient, transactions } from "../db";

export interface CreateTransactionInput {
    userId: number;
    currency: string;
    amount: number;
    type: string;
    metadata?: Record<string, unknown>;
}

export type MlmIncomeByLevel = {
    level: number;
    rewardCount: number;
    totalAmount: number;
};

export class TransactionService {
    constructor(private readonly db: DbClient) {}

    async createTransaction(input: CreateTransactionInput) {
        const result = await this.db
            .insert(transactions)
            .values({
                userId: input.userId,
                currency: input.currency,
                amount: input.amount,
                type: input.type,
                metadata: input.metadata
                    ? JSON.stringify(input.metadata)
                    : null,
            })
            .run();

        const record = await this.db.query.transactions.findFirst({
            where: eq(transactions.id, Number(result.lastInsertRowid)),
        });

        if (!record) {
            throw new Error("Failed to create transaction");
        }

        return record;
    }

    getTransactionsByUser(userId: number) {
        return this.db.query.transactions.findMany({
            where: eq(transactions.userId, userId),
            orderBy: (fields, { desc }) => desc(fields.createdAt),
        });
    }

    getAllTransactions() {
        return this.db.query.transactions.findMany({
            orderBy: (fields, { desc }) => desc(fields.createdAt),
        });
    }

    /* async getMlmIncomeByLevel(userId: string) {
    const result = await this.db
      .select({
        level: sql<number>`json_extract(${transactions.metadata}, '$.level')`.as('level'),
        rewardCount: sql<number>`COUNT(*)`.as('rewardCount'),
        totalAmount: sql<number>`SUM(${transactions.amount})`.as('totalAmount'),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, 'mlm_reward')
        )
      )
      .groupBy(sql`json_extract(${transactions.metadata}, '$.level')`)
      .orderBy(sql`json_extract(${transactions.metadata}, '$.level')`);

    return result;
  } */

    async getMlmIncomeByLevel(userId: string): Promise<MlmIncomeByLevel[]> {
        const query = sql`
    WITH RECURSIVE levels(level) AS (
      VALUES(1)
      UNION ALL
      SELECT level + 1 FROM levels WHERE level < 7
    )
    SELECT
      l.level,
      COALESCE(t.reward_count, 0) AS rewardCount,
      COALESCE(t.total_amount, 0) AS totalAmount
    FROM levels l
    LEFT JOIN (
      SELECT
        json_extract(metadata, '$.level') AS level,
        COUNT(*) AS reward_count,
        SUM(amount) AS total_amount
      FROM transactions
      WHERE user_id = ${userId} AND type = 'mlm_reward'
      GROUP BY json_extract(metadata, '$.level')
    ) t ON l.level = t.level
    ORDER BY l.level;
  `;

        const result: MlmIncomeByLevel[] = await this.db.all(query);
        return result;
    }
}
