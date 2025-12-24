import { Router } from "express";
import { z } from "zod";
import { services } from "../services";
import { isAuthenticated } from "../utils/isAuthenticated";
import { isAdmin } from "../utils/isAdmin";
import { AppError } from "../utils/AppError";

const router = Router();

const createCouponSchema = z.object({
    code: z.string().min(1),
    discount: z.number().positive(),
    discountType: z.enum(["percentage", "fixed"]).default("percentage"),
    minAmount: z.number().min(0).nullable().optional(),
    maxDiscount: z.number().positive().nullable().optional(),
    usageLimit: z.number().int().positive().nullable().optional(),
    validFrom: z.number().nullable().optional(),
    validUntil: z.number().nullable().optional(),
    isActive: z.boolean().default(true),
});

router.post("/validate", isAuthenticated, async (req, res, next) => {
    try {
        const { code, totalAmount } = req.body;
        
        if (!code || typeof totalAmount !== "number") {
            throw new AppError("Код купона и сумма обязательны", 400);
        }

        const validation = await services.couponService.validateCoupon(code, totalAmount);
        
        if (!validation.valid) {
            return res.json({ valid: false, error: validation.error });
        }

        const discount = await services.couponService.calculateDiscount(
            validation.coupon!,
            totalAmount
        );

        res.json({
            valid: true,
            coupon: validation.coupon,
            discount,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/", isAuthenticated, isAdmin, async (_req, res, next) => {
    try {
        const coupons = await services.couponService.getAllCoupons();
        res.json(coupons);
    } catch (err) {
        next(err);
    }
});

router.post("/", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const parsed = createCouponSchema.safeParse(req.body);
        
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const coupon = await services.couponService.createCoupon(parsed.data);
        res.status(201).json(coupon);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const parsed = createCouponSchema.partial().safeParse(req.body);
        
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const coupon = await services.couponService.updateCoupon(id, parsed.data);
        res.json(coupon);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await services.couponService.deleteCoupon(id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export const couponRouter = router;

