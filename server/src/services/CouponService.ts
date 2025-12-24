import { eq, and, gte, lte } from "drizzle-orm";
import type { DbClient } from "../db";
import { coupons } from "../db/schema";

export class CouponService {
    constructor(private db: DbClient) {}

    async getCouponByCode(code: string) {
        const [coupon] = await this.db
            .select()
            .from(coupons)
            .where(
                and(
                    eq(coupons.code, code.toUpperCase()),
                    eq(coupons.isActive, true)
                )
            );
        return coupon;
    }

    async validateCoupon(code: string, totalAmount: number) {
        const coupon = await this.getCouponByCode(code);
        
        if (!coupon) {
            return { valid: false, error: "Купон не найден" };
        }

        const now = Math.floor(Date.now() / 1000);

        if (coupon.validFrom && now < coupon.validFrom) {
            return { valid: false, error: "Купон ещё не действителен" };
        }

        if (coupon.validUntil && now > coupon.validUntil) {
            return { valid: false, error: "Купон истёк" };
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return { valid: false, error: "Купон исчерпан" };
        }

        if (coupon.minAmount && totalAmount < coupon.minAmount) {
            return { 
                valid: false, 
                error: `Минимальная сумма заказа: ₽${coupon.minAmount.toLocaleString('ru-RU')}` 
            };
        }

        return { valid: true, coupon };
    }

    async calculateDiscount(coupon: typeof coupons.$inferSelect, totalAmount: number) {
        let discount = 0;

        if (coupon.discountType === "fixed") {
            discount = coupon.discount;
        } else {
            discount = (totalAmount * coupon.discount) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        }

        return Math.min(discount, totalAmount);
    }

    async useCoupon(code: string) {
        const coupon = await this.getCouponByCode(code);
        if (!coupon) {
            throw new Error("Купон не найден");
        }

        await this.db
            .update(coupons)
            .set({ usedCount: coupon.usedCount + 1 })
            .where(eq(coupons.id, coupon.id));
    }

    async getAllCoupons() {
        return this.db.select().from(coupons).orderBy(coupons.createdAt);
    }

    async createCoupon(data: {
        code: string;
        discount: number;
        discountType?: string;
        minAmount?: number | null;
        maxDiscount?: number | null;
        usageLimit?: number | null;
        validFrom?: number | null;
        validUntil?: number | null;
        isActive?: boolean;
    }) {
        const [coupon] = await this.db
            .insert(coupons)
            .values({
                ...data,
                code: data.code.toUpperCase(),
                minAmount: data.minAmount ?? 0,
            })
            .returning();
        return coupon;
    }

    async updateCoupon(id: number, data: Partial<typeof coupons.$inferInsert>) {
        const [coupon] = await this.db
            .update(coupons)
            .set(data)
            .where(eq(coupons.id, id))
            .returning();
        return coupon;
    }

    async deleteCoupon(id: number) {
        await this.db.delete(coupons).where(eq(coupons.id, id));
    }
}

