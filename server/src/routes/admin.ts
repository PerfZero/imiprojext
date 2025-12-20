import { Router } from "express";
import { eq, desc, sql, like, or, inArray } from "drizzle-orm";
import { db, user, walletBalances, transactions, notifications, userVerification } from "../db";
import { isAuthenticated } from "../utils/isAuthenticated";
import { isAdmin } from "../utils/isAdmin";
import { services } from "../services";
import { AppError } from "../utils/AppError";

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

router.get("/referrals", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const search = (req.query.search as string) || "";
        const offset = (page - 1) * limit;

        const whereClause = search
            ? or(
                  like(user.email, `%${search}%`),
                  like(user.name, `%${search}%`),
                  like(user.phone, `%${search}%`),
                  like(user.referralCode, `%${search}%`)
              )
            : undefined;

        const users = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                referralCode: user.referralCode,
                referrerId: user.referrerId,
                referrerCode: user.referrerCode,
                createdAt: user.created_at,
            })
            .from(user)
            .where(whereClause)
            .orderBy(desc(user.created_at))
            .limit(limit)
            .offset(offset);

        const referrerIds = users
            .map(u => u.referrerId)
            .filter((id): id is string => !!id);

        const referrers = referrerIds.length > 0
            ? await db
                  .select({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      referralCode: user.referralCode,
                  })
                  .from(user)
                  .where(inArray(user.id, referrerIds))
            : [];

        const referrersMap = new Map(referrers.map(r => [r.id, r]));

        const usersWithReferrers = users.map(u => ({
            ...u,
            referrer: u.referrerId ? referrersMap.get(u.referrerId) : null,
        }));

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(user)
            .where(whereClause);
        const count = countResult[0]?.count ?? 0;

        res.json({
            data: usersWithReferrers,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching referrals:", error);
        res.status(500).json({ error: "Failed to fetch referrals" });
    }
});

router.get("/referrals/stats", async (req, res) => {
    try {
        const totalUsers = await db
            .select({ count: sql<number>`count(*)` })
            .from(user);
        
        const usersWithReferrers = await db
            .select({ count: sql<number>`count(*)` })
            .from(user)
            .where(sql`${user.referrerId} IS NOT NULL`);

        const topReferrers = await db
            .select({
                referrerId: user.referrerId,
                count: sql<number>`count(*)`,
            })
            .from(user)
            .where(sql`${user.referrerId} IS NOT NULL`)
            .groupBy(user.referrerId)
            .orderBy(desc(sql`count(*)`))
            .limit(10);

        const referrerIds = topReferrers.map(t => t.referrerId).filter((id): id is string => !!id);
        const referrerDetails = referrerIds.length > 0
            ? await db
                  .select({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      referralCode: user.referralCode,
                  })
                  .from(user)
                  .where(inArray(user.id, referrerIds))
            : [];

        const referrerDetailsMap = new Map(referrerDetails.map(r => [r.id, r]));

        const topReferrersWithDetails = topReferrers.map(tr => ({
            ...referrerDetailsMap.get(tr.referrerId),
            referralsCount: tr.count,
        }));

        res.json({
            totalUsers: totalUsers[0]?.count ?? 0,
            usersWithReferrers: usersWithReferrers[0]?.count ?? 0,
            usersWithoutReferrers: (totalUsers[0]?.count ?? 0) - (usersWithReferrers[0]?.count ?? 0),
            topReferrers: topReferrersWithDetails,
        });
    } catch (error) {
        console.error("Error fetching referral stats:", error);
        res.status(500).json({ error: "Failed to fetch referral stats" });
    }
});

router.get("/referrals/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const [userData] = await db
            .select()
            .from(user)
            .where(eq(user.id, userId));

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        const directReferrals = await db
            .select()
            .from(user)
            .where(eq(user.referrerId, userId))
            .orderBy(desc(user.created_at));

        const upline = await services.userService.getUpline(userId, 7);

        res.json({
            user: userData,
            directReferrals,
            directReferralsCount: directReferrals.length,
            upline: upline.map((u, index) => ({
                ...u,
                level: index + 1,
            })),
        });
    } catch (error) {
        console.error("Error fetching user referrals:", error);
        res.status(500).json({ error: "Failed to fetch user referrals" });
    }
});

router.get("/verifications", async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const status = req.query.status as string;
        const offset = (page - 1) * limit;

        let query = db.select().from(userVerification);

        if (status) {
            query = query.where(eq(userVerification.status, status)) as typeof query;
        }

        const data = await query
            .orderBy(desc(userVerification.createdAt))
            .limit(limit)
            .offset(offset);

        const verificationsWithUsers = await Promise.all(
            data.map(async (verification) => {
                const userData = await services.userService.getUserById(verification.userId);
                const reviewer = verification.reviewedBy
                    ? await services.userService.getUserById(verification.reviewedBy)
                    : null;
                return {
                    ...verification,
                    user: userData
                        ? {
                              id: userData.id,
                              name: userData.name,
                              email: userData.email,
                          }
                        : null,
                    reviewer: reviewer
                        ? {
                              id: reviewer.id,
                              name: reviewer.name,
                          }
                        : null,
                };
            })
        );

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(userVerification)
            .where(status ? eq(userVerification.status, status) : undefined);
        const count = countResult[0]?.count ?? 0;

        res.json({
            data: verificationsWithUsers,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (err) {
        next(err);
    }
});

router.post("/verifications/:id/approve", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const userId = (req as any).userId;

        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }

        const verification = await services.verificationService.updateVerificationStatus(id, {
            status: "approved",
            reviewedBy: userId,
        });

        const userData = await services.userService.getUserById(verification.userId);
        if (userData) {
            await services.notificationService.createNotification({
                userId: verification.userId,
                category: "verification",
                subcategory: "approved",
                message: "Ваша верификация одобрена",
            });
        }

        res.json(verification);
    } catch (err) {
        next(err);
    }
});

router.post("/verifications/:id/reject", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const userId = (req as any).userId;
        const { reason } = req.body;

        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }

        if (!reason || !reason.trim()) {
            throw new AppError("Причина отклонения обязательна", 400);
        }

        const verification = await services.verificationService.updateVerificationStatus(id, {
            status: "rejected",
            reviewedBy: userId,
            rejectionReason: reason,
        });

        const userData = await services.userService.getUserById(verification.userId);
        if (userData) {
            await services.notificationService.createNotification({
                userId: verification.userId,
                category: "verification",
                subcategory: "rejected",
                message: `Верификация отклонена: ${reason}`,
            });
        }

        res.json(verification);
    } catch (err) {
        next(err);
    }
});

export default router;



