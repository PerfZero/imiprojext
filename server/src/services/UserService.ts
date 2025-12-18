import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { DbClient, User, user as users } from "../db";
import { generateReferralCode } from "../utils/referral";

export interface CreateUserInput {
    name: string;
    email: string;
    phone: string;
    referrerCode?: string | undefined;
}

export class UserService {
    constructor(private readonly db: DbClient) {}

    async createUser(input: CreateUserInput) {
        const referralCode = await generateReferralCode(this.db);
        const referrerId = input.referrerCode
            ? await this.findReferrerId(input.referrerCode)
            : null;

        const values: any = {
            id: randomUUID(),
            name: input.name,
            email: input.email,
            phone: input.phone,
            referralCode,
        };

        if (referrerId) {
            values.referrerId = referrerId;
        }

        const result = await this.db
            .insert(users)
            .values(values)
            .returning();

        if (!result[0]) {
            throw new Error("Failed to create user");
        }

        const created = await this.getUserById(result[0].id);
        if (!created) {
            throw new Error("Failed to create user");
        }
        return created;
    }

    getUserById(id: string) {
        return this.db.query.user.findFirst({
            where: eq(users.id, id),
        });
    }

    getUserRefferer(referrerId: string) {
        return this.db.query.user.findFirst({
            where: eq(users.id, referrerId),
        });
    }

    getUserByReferralCode(code: string) {
        return this.db.query.user.findFirst({
            where: eq(users.referralCode, code),
        });
    }

    async getUpline(userId: string, levels = 7) {
        const upline: User[] = [];
        let currentId: string | null = userId;

        for (let level = 0; level < levels; level += 1) {
            if (!currentId) break;

            const user: User | undefined = await this.db.query.user.findFirst({
                where: eq(users.id, currentId),
            });

            if (!user?.referrerId) break;

            const referrer: User | undefined =
                await this.db.query.user.findFirst({
                    where: eq(users.id, user.referrerId),
                });

            if (!referrer) break;

            upline.push(referrer);
            currentId = referrer.referrerId ?? null;
        }

        return upline;
    }

    async getReferralTree(userId: string, maxDepth = 3): Promise<any> {
        const buildTree = async (parentId: string, depth: number): Promise<any[]> => {
            if (depth > maxDepth) return [];

            const directReferrals = await this.db.query.user.findMany({
                where: eq(users.referrerId, parentId),
            });

            const tree = await Promise.all(
                directReferrals.map(async (user) => {
                    const children = await buildTree(user.id, depth + 1);
                    return {
                        ...user,
                        children,
                        level: depth,
                    };
                })
            );

            return tree;
        };

        return buildTree(userId, 1);
    }

    async updateAvatar(userId: string, imagePath: string) {
        await this.db
            .update(users)
            .set({ image: imagePath })
            .where(eq(users.id, userId));

        return this.getUserById(userId);
    }

    private async findReferrerId(code: string) {
        const referrer = await this.getUserByReferralCode(code);
        return referrer?.id ?? null;
    }
}
