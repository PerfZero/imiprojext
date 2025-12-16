import { eq, and } from "drizzle-orm";
import { DbClient, notifications } from "../db";
import { sendNotificationToUser } from "../utils/ws";

export interface CreateNotificationInput {
    userId?: string | null;
    category: string;
    subcategory: string;
    message: string;
    data?: Record<string, unknown>;
}

export class NotificationService {
    constructor(private readonly db: DbClient) {}

    async createNotification(input: CreateNotificationInput) {
        const result = await this.db
            .insert(notifications)
            .values({
                userId: input.userId ?? null,
                category: input.category,
                subcategory: input.subcategory,
                message: input.message,
                data: input.data ? JSON.stringify(input.data) : null,
            })
            .returning();

        sendNotificationToUser(input.userId, result[0]);

        return result[0];
    }

    getNotifications(userId?: string) {
        return this.db.query.notifications.findMany({
            where: and(
                eq(notifications.userId, userId),
                eq(notifications.is_read, false)
            ),
            orderBy: (fields, { desc }) => desc(fields.createdAt),
        });
    }

    async markAsReadAll(userId?: string) {
        let result = await this.db
            .update(notifications)
            .set({ is_read: 1 })
            .where(eq(notifications.userId, userId));
    }
}
