import { Router } from "express";
import { eq, desc, sql, like, or } from "drizzle-orm";
import { db, user, walletBalances, transactions, notifications } from "../db";
import { isAuthenticated } from "../utils/isAuthenticated";
import { isAdmin } from "../utils/isAdmin";

const router = Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get("/stats", async (req, res) => {
    try {
        const usersResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(user);

        const transactionsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(transactions);

        const balanceResult = await db
            .select({ total: sql<number>`coalesce(sum(balance), 0)` })
            .from(walletBalances);

        const notificationsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(notifications);

        res.json({
            users: usersResult[0]?.count ?? 0,
            transactions: transactionsResult[0]?.count ?? 0,
            totalBalance: balanceResult[0]?.total ?? 0,
            notifications: notificationsResult[0]?.count ?? 0,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

router.get("/users", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = (req.query.search as string) || "";
        const offset = (page - 1) * limit;

        const whereClause = search
            ? or(
                  like(user.email, `%${search}%`),
                  like(user.name, `%${search}%`),
                  like(user.phone, `%${search}%`)
              )
            : undefined;

        const users = await db
            .select()
            .from(user)
            .where(whereClause)
            .orderBy(desc(user.created_at))
            .limit(limit)
            .offset(offset);

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(user)
            .where(whereClause);
        const count = countResult[0]?.count ?? 0;

        res.json({
            data: users,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const [userData] = await db
            .select()
            .from(user)
            .where(eq(user.id, req.params.id));

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        const balances = await db
            .select()
            .from(walletBalances)
            .where(eq(walletBalances.userId, req.params.id));

        res.json({ ...userData, balances });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.patch("/users/:id", async (req, res) => {
    try {
        const { name, email, phone, role, banned, banReason } = req.body;

        await db
            .update(user)
            .set({
                ...(name && { name }),
                ...(email && { email }),
                ...(phone && { phone }),
                ...(role && { role }),
                ...(typeof banned === "boolean" && { banned }),
                ...(banReason !== undefined && { banReason }),
            })
            .where(eq(user.id, req.params.id));

        const [updated] = await db
            .select()
            .from(user)
            .where(eq(user.id, req.params.id));

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        await db.delete(walletBalances).where(eq(walletBalances.userId, userId));
        await db.delete(transactions).where(eq(transactions.userId, userId));
        await db.delete(notifications).where(eq(notifications.userId, userId));
        await db.delete(user).where(eq(user.id, userId));

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

router.get("/transactions", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const userId = req.query.userId as string;
        const type = req.query.type as string;
        const offset = (page - 1) * limit;

        let query = db.select().from(transactions);

        if (userId) {
            query = query.where(eq(transactions.userId, userId)) as typeof query;
        }
        if (type) {
            query = query.where(eq(transactions.type, type)) as typeof query;
        }

        const data = await query
            .orderBy(desc(transactions.createdAt))
            .limit(limit)
            .offset(offset);

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(transactions);
        const count = countResult[0]?.count ?? 0;

        res.json({
            data,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

router.get("/wallets", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const data = await db
            .select({
                id: walletBalances.id,
                userId: walletBalances.userId,
                currency: walletBalances.currency,
                balance: walletBalances.balance,
                updatedAt: walletBalances.updatedAt,
                userName: user.name,
                userEmail: user.email,
            })
            .from(walletBalances)
            .leftJoin(user, eq(walletBalances.userId, user.id))
            .orderBy(desc(walletBalances.updatedAt))
            .limit(limit)
            .offset(offset);

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(walletBalances);
        const count = countResult[0]?.count ?? 0;

        res.json({
            data,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch wallets" });
    }
});

router.patch("/wallets/:id", async (req, res) => {
    try {
        const { balance } = req.body;

        await db
            .update(walletBalances)
            .set({ balance })
            .where(eq(walletBalances.id, parseInt(req.params.id)));

        const [updated] = await db
            .select()
            .from(walletBalances)
            .where(eq(walletBalances.id, parseInt(req.params.id)));

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update wallet" });
    }
});

router.get("/notifications", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const data = await db
            .select()
            .from(notifications)
            .orderBy(desc(notifications.createdAt))
            .limit(limit)
            .offset(offset);

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(notifications);
        const count = countResult[0]?.count ?? 0;

        res.json({
            data,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

export default router;



