import { Router } from "express";
import { isAuthenticated } from "./../utils/isAuthenticated";
import { z } from "zod";

import { AppError } from "../utils/AppError";
import { services } from "../services";

const router = Router();

const balanceChangeSchema = z.object({
    currency: z.string().min(1),
    amount: z.number().positive(),
});

const convertSchema = z.object({
    fromCurrency: z.string().min(1),
    toCurrency: z.string().min(1),
    amount: z.number().positive(),
    rate: z.number().positive(),
});

const purchaseSchema = z.object({
    currency: z.string().min(1),
    amount: z.number().positive(),
    description: z.string().optional(),
});

router.post("/deposit", isAuthenticated, async (req, res, next) => {
    try {
        const parsed = balanceChangeSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }
        parsed.data.userId = req.userId;

        const balance = await services.walletService.deposit(parsed.data);
        res.status(201).json(balance);
    } catch (err) {
        next(err);
    }
});

router.post("/withdraw", isAuthenticated, async (req, res, next) => {
    try {
        const parsed = balanceChangeSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }
        parsed.data.userId = req.userId;
        const balance = await services.walletService.withdraw(parsed.data);
        res.json(balance);
    } catch (err) {
        next(err);
    }
});

router.post("/convert", isAuthenticated, async (req, res, next) => {
    try {
        const parsed = convertSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        parsed.data.userId = req.userId;

        const balance = await services.walletService.convert(parsed.data);
        res.json(balance);
    } catch (err) {
        next(err);
    }
});

router.post("/purchase", isAuthenticated, async (req, res, next) => {
    try {
        const parsed = purchaseSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }
        parsed.data.userId = req.userId;
        await services.walletService.purchase(parsed.data);
        res.status(201).json({ status: "ok" });
    } catch (err) {
        next(err);
    }
});

export const walletRouter = router;
