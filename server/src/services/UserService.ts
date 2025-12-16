import { eq } from "drizzle-orm";

import { DbClient, User, user as users } from "../db";
import { generateReferralCode } from "../utils/referral";

export interface CreateUserInput {
    name: string;
    email: string;
    phone?: string | null | undefined;
    referrerCode?: string | undefined;
}

export class UserService {
    constructor(private readonly db: DbClient) {}

    async createUser(input: CreateUserInput) {
        const referralCode = await generateReferralCode(this.db);
        const referrerId = input.referrerCode
            ? await this.findReferrerId(input.referrerCode)
            : null;

        const result = await this.db
            .insert(users)
            .values({
                name: input.name,
                email: input.email,
                phone: input.phone ?? null,
                referrerId,
                referralCode,
            })
            .run();

        const created = await this.getUserById(
            result.lastInsertRowid as string
        );
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
