import { Router } from "express";
import { isAuthenticated } from "./../utils/isAuthenticated";
import { AppError } from "../utils/AppError";
import { services } from "../services";

const router = Router();

router.get("/", isAuthenticated, async (req, res, next) => {
    try {
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
        const items = await services.notificationService.markAsReadAll(
            req.userId
        );
        res.json({});
    } catch (err) {
        next(err);
    }
});

export const notificationRouter = router;
