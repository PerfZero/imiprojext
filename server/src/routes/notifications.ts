import { Router } from "express";
import { isAuthenticated } from "./../utils/isAuthenticated";
import { AppError } from "../utils/AppError";
import { services } from "../services";

const router = Router();

router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        const items = await services.notificationService.getNotifications(
            req.userId
        );
        res.json(items);
    } catch (err) {
        next(err);
    }
});

router.post("/markAsReadAll", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        await services.notificationService.markAsReadAll(req.userId);
        res.json({});
    } catch (err) {
        next(err);
    }
});

export const notificationRouter = router;
