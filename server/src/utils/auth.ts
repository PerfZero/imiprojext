import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { toNodeHandler } from "better-auth/node";
import { admin } from "better-auth/plugins";

import { db } from "../db";
import { generateReferralCode, getUserByReferralCode } from "../utils/referral";

import { services } from "../services";

export const auth = betterAuth({
    appName: "IMI Core",
    basePath: "/auth",
    secret: process.env.BETTER_AUTH_SECRET ?? "better-auth-secret-dev",
    emailAndPassword: { enabled: true },
    plugins: [admin()] as any,
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    trustedOrigins: [
        "https://imiclub.pro",
        "http://imiclub.pro",
        "https://demka.space",
        "http://192.168.31.13:5173",
        "http://localhost:5173",
    ],
    user: {
        fields: {
            createdAt: "created_at",
            updatedAt: "updated_at",
            emailVerified: "email_verified",
        },
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false, // don't allow user to set role
            },
            phone: {
                type: "string",
                required: true,
                fieldName: "phone",
            },
            referralCode: {
                type: "string",
                fieldName: "referralCode",
                returned: true,
                input: false,
            },
            referrerId: {
                type: "string",
                fieldName: "referrerId",
                input: false,
                returned: true,
            },
            referrerCode: {
                type: "string",
                fieldName: "referrerCode",
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (data) => {
                    const updates: Record<string, unknown> = {};
                    updates.referralCode = await generateReferralCode(db);

                    if (data.referrerCode && typeof data.referrerCode === "string") {
                        const referrer = await getUserByReferralCode(
                            db,
                            data.referrerCode
                        );
                        if (referrer) updates.referrerId = referrer.id;
                    }
                    return Object.keys(updates).length
                        ? { data: updates }
                        : undefined;
                },
                after: async (data) => {
                    const balances =
                        await services.walletService.createBalances(data.id);

                    if (data.referrerId && typeof data.referrerId === "string") {
                        await services.notificationService.createNotification({
                            userId: data.referrerId,
                            category: "mlm",
                            subcategory: "new_ref",
                            message: `Новый реферал зарегестрировался по вашей ссылке`,
                        });
                    }
                },
            },
        },
    },
});

export const authHandler = toNodeHandler(auth);
