import { eq, desc, and } from "drizzle-orm";
import type { DbClient } from "../db";
import { orders, orderItems, products, cartItems } from "../db/schema";
import { user as users } from "../db/auth-schema";

export class OrderService {
    constructor(private db: DbClient) {}

    async createOrder(
        userId: string,
        data: {
            shippingAddress: string;
            shippingCity: string;
            shippingPhone: string;
            shippingName: string;
            comment?: string;
        }
    ) {
        const cart = await this.db
            .select({
                id: cartItems.id,
                productId: cartItems.productId,
                quantity: cartItems.quantity,
                product: {
                    id: products.id,
                    name: products.name,
                    price: products.price,
                    currency: products.currency,
                    image: products.image,
                    discount: products.discount,
                    discountType: products.discountType,
                    stock: products.stock,
                },
            })
            .from(cartItems)
            .leftJoin(products, eq(cartItems.productId, products.id))
            .where(eq(cartItems.userId, userId));

        if (cart.length === 0) {
            throw new Error("Корзина пуста");
        }

        let totalAmount = 0;
        const items: Array<{
            productId: number;
            quantity: number;
            price: number;
            productName: string;
            productImage: string | null;
        }> = [];

        for (const item of cart) {
            if (!item.product) continue;
            
            if (item.product.stock < item.quantity) {
                throw new Error(`Недостаточно товара "${item.product.name}" на складе`);
            }

            let price = item.product.price;
            if (item.product.discount) {
                if (item.product.discountType === "fixed") {
                    price = Math.max(0, price - item.product.discount);
                } else {
                    price = Math.round(price * (1 - item.product.discount / 100));
                }
            }

            totalAmount += price * item.quantity;
            items.push({
                productId: item.product.id,
                quantity: item.quantity,
                price,
                productName: item.product.name,
                productImage: item.product.image,
            });
        }

        const [order] = await this.db
            .insert(orders)
            .values({
                userId,
                totalAmount,
                currency: cart[0].product?.currency || "RUB",
                shippingAddress: data.shippingAddress,
                shippingCity: data.shippingCity,
                shippingPhone: data.shippingPhone,
                shippingName: data.shippingName,
                comment: data.comment,
            })
            .returning();

        for (const item of items) {
            await this.db.insert(orderItems).values({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                productName: item.productName,
                productImage: item.productImage,
            });

            const product = await this.db
                .select()
                .from(products)
                .where(eq(products.id, item.productId))
                .limit(1);

            if (product[0]) {
                await this.db
                    .update(products)
                    .set({ stock: product[0].stock - item.quantity })
                    .where(eq(products.id, item.productId));
            }
        }

        await this.db.delete(cartItems).where(eq(cartItems.userId, userId));

        return { order, totalAmount };
    }

    async getUserOrders(userId: string) {
        const userOrders = await this.db
            .select()
            .from(orders)
            .where(eq(orders.userId, userId))
            .orderBy(desc(orders.createdAt));

        const result = await Promise.all(
            userOrders.map(async (order) => {
                const items = await this.db
                    .select()
                    .from(orderItems)
                    .where(eq(orderItems.orderId, order.id));
                return { ...order, items };
            })
        );

        return result;
    }

    async getOrderById(orderId: number, userId?: string) {
        const conditions = userId
            ? and(eq(orders.id, orderId), eq(orders.userId, userId))
            : eq(orders.id, orderId);

        const [order] = await this.db
            .select()
            .from(orders)
            .where(conditions);

        if (!order) return null;

        const items = await this.db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, orderId));

        return { ...order, items };
    }

    async getAllOrders() {
        const allOrders = await this.db
            .select({
                order: orders,
                user: {
                    id: users.id,
                    name: users.name,
                    email: users.email,
                },
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .orderBy(desc(orders.createdAt));

        const result = await Promise.all(
            allOrders.map(async ({ order, user }) => {
                const items = await this.db
                    .select()
                    .from(orderItems)
                    .where(eq(orderItems.orderId, order.id));
                return { ...order, user, items };
            })
        );

        return result;
    }

    async updateOrderStatus(orderId: number, status: string) {
        const [order] = await this.db
            .update(orders)
            .set({ status, updatedAt: Math.floor(Date.now() / 1000) })
            .where(eq(orders.id, orderId))
            .returning();
        return order;
    }
}




