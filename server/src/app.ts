import "dotenv/config";

import express from "express";
import path from "node:path";
const { createServer } = require("http");
const { createWebSocketServer } = require("./utils/ws");

import swaggerUi from "swagger-ui-express";

import { fromNodeHeaders } from "better-auth/node";
import { auth, authHandler } from "./utils/auth";

import { swaggerSpec } from "./docs/swagger";
import { notificationRouter } from "./routes/notifications";
import { transactionRouter } from "./routes/transactions";
import { userRouter } from "./routes/users";
import { walletRouter } from "./routes/wallet";
import { productRouter } from "./routes/products";
import { uploadRouter } from "./routes/upload";
import { verificationRouter } from "./routes/verification";
import { cartRouter } from "./routes/cart";
import { ordersRouter } from "./routes/orders";
import { couponRouter } from "./routes/coupons";
import adminRouter from "./routes/admin";
import { errorHandler } from "./utils/errorHandler";

export async function createAdminIfNotExists() {
    console.log("ℹ️ Создание администратора должно быть выполнено вручную через API /api/auth/sign-up");
}

export function createApp() {
    createAdminIfNotExists();

    const app = express();
    const server = createServer(app);
    createWebSocketServer(server);

    const allowedOrigins = [
        "https://imiclub.pro",
        "http://imiclub.pro",
        "https://demka.space",
        "http://localhost:5173",
        "http://192.168.31.13:5173",
        "http://79.174.77.143",
        "http://79.174.77.143:3000",
        "https://localhost",
        "http://localhost",
    ];

    app.use((req, res, next) => {
        const origin = req.headers.origin;
        const userAgent = req.headers["user-agent"] || "";
        const isMobileApp = userAgent.includes("CapacitorHttp") || !origin || origin?.includes("localhost");
        
        if (isMobileApp || (origin && allowedOrigins.includes(origin))) {
            if (origin) {
                res.setHeader("Access-Control-Allow-Origin", origin);
            } else {
                res.setHeader("Access-Control-Allow-Origin", "*");
            }
        } else if (origin) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        }
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next();
    });

    app.use(express.json());
    app.use("/static", express.static(path.join(process.cwd(), "public")));
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
    app.use(express.static(path.join(process.cwd(), "public")));

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/docs.json", (_req, res) => {
        res.json(swaggerSpec);
    });

    app.all("/api/auth/{*any}", authHandler);
    app.use(async (req, res, next) => {
        let session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    session = await auth.api.getSession({
                        headers: {
                            cookie: `better-auth.session_token=${token}`,
                        },
                    });
                } catch (e) {
                    console.error("Error getting session from token:", e);
                }
            }
        }

        if (session && "user" in session && session.user) {
            req.session = session;
            req.userId = session.user.id;
        }
        next();
    });

    app.use("/api/users", userRouter);
    app.use("/api/wallet", walletRouter);
    app.use("/api/transactions", transactionRouter);
    app.use("/api/notifications", notificationRouter);
    app.use("/api/products", productRouter);
    app.use("/api/upload", uploadRouter);
    app.use("/api/verification", verificationRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/orders", ordersRouter);
    app.use("/api/coupons", couponRouter);
    app.use("/api/admin", adminRouter);

    app.use(errorHandler);
    return server;
}
