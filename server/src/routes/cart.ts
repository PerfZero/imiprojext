import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { cartItems, products } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { isAuthenticated } from "../utils/isAuthenticated";
import { AppError } from "../utils/AppError";

const router = Router();

const addToCartSchema = z.object({
    productId: z.number(),
    quantity: z.number().min(1).default(1),
});

const updateCartSchema = z.object({
    quantity: z.number().min(0),
});

router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;

        const items = await db
            .select({
                id: cartItems.id,
                productId: cartItems.productId,
                quantity: cartItems.quantity,
                product: {
                    id: products.id,
                    name: products.name,
                    description: products.description,
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

        res.json(items);
    } catch (err) {
        next(err);
    }
});

router.post("/add", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;
        const parsed = addToCartSchema.safeParse(req.body);
        
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const { productId, quantity } = parsed.data;

        const product = await db
            .select()
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);

        if (product.length === 0) {
            throw new AppError("Товар не найден", 404);
        }

        const existing = await db
            .select()
            .from(cartItems)
            .where(
                and(
                    eq(cartItems.userId, userId),
                    eq(cartItems.productId, productId)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            const newQuantity = existing[0].quantity + quantity;
            await db
                .update(cartItems)
                .set({ quantity: newQuantity, updatedAt: Math.floor(Date.now() / 1000) })
                .where(eq(cartItems.id, existing[0].id));
            res.json({ success: true, quantity: newQuantity });
        } else {
            await db.insert(cartItems).values({
                userId,
                productId,
                quantity,
            });
            res.status(201).json({ success: true, quantity });
        }
    } catch (err) {
        next(err);
    }
});

router.put("/:id", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;
        const id = parseInt(req.params.id);
        const parsed = updateCartSchema.safeParse(req.body);

        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const { quantity } = parsed.data;

        if (quantity <= 0) {
            await db
                .delete(cartItems)
                .where(
                    and(
                        eq(cartItems.id, id),
                        eq(cartItems.userId, userId)
                    )
                );
            res.json({ success: true, deleted: true });
        } else {
            await db
                .update(cartItems)
                .set({ quantity, updatedAt: Math.floor(Date.now() / 1000) })
                .where(
                    and(
                        eq(cartItems.id, id),
                        eq(cartItems.userId, userId)
                    )
                );
            res.json({ success: true });
        }
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;
        const id = parseInt(req.params.id);

        await db
            .delete(cartItems)
            .where(
                and(
                    eq(cartItems.id, id),
                    eq(cartItems.userId, userId)
                )
            );

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.delete("/", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;

        await db.delete(cartItems).where(eq(cartItems.userId, userId));

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export const cartRouter = router;
