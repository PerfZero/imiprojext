import { eq, and, desc, sql } from "drizzle-orm";
import { DbClient, userVerification, user as users } from "../db";

export interface CreateVerificationInput {
    userId: string;
    passportPage1Url: string;
    passportPage2Url: string;
    selfieWithPassportUrl: string;
}

export interface UpdateVerificationStatusInput {
    status: "pending" | "approved" | "rejected";
    reviewedBy: string;
    rejectionReason?: string;
}

export class VerificationService {
    constructor(private readonly db: DbClient) {}

    async getVerificationByUserId(userId: string) {
        return this.db.query.userVerification.findFirst({
            where: eq(userVerification.userId, userId),
            orderBy: [desc(userVerification.createdAt)],
        });
    }

    async createVerification(input: CreateVerificationInput) {
        const existing = await this.getVerificationByUserId(input.userId);
        
        if (existing && existing.status === "pending") {
            throw new Error("Verification already in progress");
        }

        if (existing && existing.status === "approved") {
            throw new Error("User already verified");
        }

        const result = await this.db
            .insert(userVerification)
            .values({
                userId: input.userId,
                passportPage1Url: input.passportPage1Url,
                passportPage2Url: input.passportPage2Url,
                selfieWithPassportUrl: input.selfieWithPassportUrl,
                status: "pending",
            })
            .returning();

        if (!result[0]) {
            throw new Error("Failed to create verification");
        }

        await this.db
            .update(users)
            .set({ verificationStatus: "pending" })
            .where(eq(users.id, input.userId));

        return result[0];
    }

    async updateVerificationStatus(
        id: number,
        input: UpdateVerificationStatusInput
    ) {
        const verification = await this.db.query.userVerification.findFirst({
            where: eq(userVerification.id, id),
        });

        if (!verification) {
            throw new Error("Verification not found");
        }

        await this.db
            .update(userVerification)
            .set({
                status: input.status,
                reviewedBy: input.reviewedBy,
                rejectionReason: input.rejectionReason || null,
                reviewedAt: Date.now(),
                updatedAt: sql`(strftime('%s','now'))`,
            })
            .where(eq(userVerification.id, id));

        await this.db
            .update(users)
            .set({ verificationStatus: input.status === "approved" ? "verified" : input.status })
            .where(eq(users.id, verification.userId));

        return this.db.query.userVerification.findFirst({
            where: eq(userVerification.id, id),
        });
    }

    async getAllVerifications(status?: string) {
        if (status) {
            return this.db.query.userVerification.findMany({
                where: eq(userVerification.status, status),
                orderBy: [desc(userVerification.createdAt)],
            });
        }

        return this.db.query.userVerification.findMany({
            orderBy: [desc(userVerification.createdAt)],
        });
    }

    async getVerificationById(id: number) {
        return this.db.query.userVerification.findFirst({
            where: eq(userVerification.id, id),
        });
    }
}

