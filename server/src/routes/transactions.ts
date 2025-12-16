import { Router } from "express";
import { isAuthenticated } from "./../utils/isAuthenticated";
import { AppError } from "../utils/AppError";
import { services } from "../services";

const router = Router();

router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        const items = await services.transactionService.getTransactionsByUser(
            req.userId
        );
        return res.json(items);
    } catch (err) {
        next(err);
    }
});

router.get("/incomeByLevel", isAuthenticated, async (req, res, next) => {
    try {
        const items = await services.transactionService.getMlmIncomeByLevel(
            req.userId
        );

        return res.json(items);
    } catch (err) {
        next(err);
    }
});

export const transactionRouter = router;
