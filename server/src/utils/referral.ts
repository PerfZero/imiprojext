import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { DbClient, user as users } from "../db";

export async function generateReferralCode(db: DbClient) {
    while (true) {
        const [segment] = randomUUID().split("-");
        const candidate = (segment ?? randomUUID()).slice(0, 12);
        const existing = await db.query.user.findFirst({
            where: eq(users.referralCode, candidate),
        });
        if (!existing) {
            return candidate;
        }
    }
}

export async function getUserByReferralCode(db: DbClient, code: string) {
    return db.query.user.findFirst({
        where: eq(users.referralCode, code),
    });
}
