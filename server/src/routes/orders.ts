import { Router } from "express";
import { z } from "zod";
import { services } from "../services";
import { isAuthenticated } from "../utils/isAuthenticated";
import { isAdmin } from "../utils/isAdmin";
import { AppError } from "../utils/AppError";

const router = Router();

const createOrderSchema = z.object({
    shippingAddress: z.string().min(1, "Адрес обязателен"),
    shippingCity: z.string().min(1, "Город обязателен"),
    shippingPhone: z.string().min(1, "Телефон обязателен"),
    shippingName: z.string().min(1, "Имя получателя обязательно"),
    comment: z.string().optional(),
});

router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;
        const orders = await services.orderService.getUserOrders(userId);
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.get("/all", isAuthenticated, isAdmin, async (_req, res, next) => {
    try {
        const orders = await services.orderService.getAllOrders();
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;
        const orderId = parseInt(req.params.id);
        const order = await services.orderService.getOrderById(orderId, userId);
        
        if (!order) {
            throw new AppError("Заказ не найден", 404);
        }
        
        res.json(order);
    } catch (err) {
        next(err);
    }
});

router.post("/", isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.userId!;
        const parsed = createOrderSchema.safeParse(req.body);
        
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const result = await services.orderService.createOrder(userId, parsed.data);

        await services.walletService.purchase(
            userId,
            result.totalAmount,
            "RUB",
            `Заказ #${result.order.id}`
        );

        res.status(201).json(result.order);
    } catch (err) {
        next(err);
    }
});

router.put("/:id/status", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.id);
        const { status } = req.body;
        
        if (!status) {
            throw new AppError("Статус обязателен", 400);
        }
        
        const order = await services.orderService.updateOrderStatus(orderId, status);
        res.json(order);
    } catch (err) {
        next(err);
    }
});

export const ordersRouter = router;
