import "dotenv/config";

import express from "express";
import path from "node:path";
const { createServer } = require("http");
const { createWebSocketServer } = require("./utils/ws");

import swaggerUi from "swagger-ui-express";

import { fromNodeHeaders } from "better-auth/node";
import { auth, authHandler } from "./utils/auth";
import { db } from "./db";
import { session as sessionTable, user as userTable } from "./db/auth-schema";
import { eq, and, gt } from "drizzle-orm";

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

    // Кастомный эндпоинт для проверки сессии мобильным приложением
    app.get("/api/auth/get-session", async (req, res, next) => {
        console.log("[Get-Session] Request headers:", {
            cookie: req.headers.cookie ? 'present' : 'missing',
            authorization: req.headers.authorization ? 'present' : 'missing',
            origin: req.headers.origin,
        });
        
        // Сначала пробуем стандартный способ (cookies)
        let session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        console.log("[Get-Session] Session from better-auth:", session ? 'found' : 'not found');
        
        // Если не нашли через cookies — пробуем Authorization header
        if (!session) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                console.log("[Get-Session] Token from Authorization header:", token);
                
                try {
                    const now = Date.now();
                    const sessionRows = await db
                        .select()
                        .from(sessionTable)
                        .where(
                            and(
                                eq(sessionTable.token, token),
                                gt(sessionTable.expiresAt, new Date(now))
                            )
                        )
                        .limit(1);
                    
                    const sessionRow = sessionRows[0];
                    if (sessionRow) {
                        const userRows = await db
                            .select()
                            .from(userTable)
                            .where(eq(userTable.id, sessionRow.userId))
                            .limit(1);
                        
                        const userRow = userRows[0];
                        if (userRow) {
                            session = {
                                user: userRow,
                                session: sessionRow
                            } as any;
                            console.log("[Get-Session] Session found from DB:", sessionRow.userId);
                        }
                    } else {
                        console.log("[Get-Session] Session not found in DB for token");
                    }
                } catch (e) {
                    console.error("[Get-Session] Error getting session from DB:", e);
                }
            }
        }
        
        if (session) {
            return res.json(session);
        }
        return res.json({ user: null, session: null });
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
                console.log("[Auth Middleware] Token from Authorization header:", token);
                
                // Напрямую ищем сессию в базе данных
                try {
                    const now = Date.now();
                    const sessionRows = await db
                        .select()
                        .from(sessionTable)
                        .where(
                            and(
                                eq(sessionTable.token, token),
                                gt(sessionTable.expiresAt, new Date(now))
                            )
                        )
                        .limit(1);
                    
                    const sessionRow = sessionRows[0];
                    if (sessionRow) {
                        const userRows = await db
                            .select()
                            .from(userTable)
                            .where(eq(userTable.id, sessionRow.userId))
                            .limit(1);
                        
                        const userRow = userRows[0];
                        if (userRow) {
                            session = {
                                user: userRow,
                                session: sessionRow
                            } as any;
                            console.log("[Auth Middleware] Session found from DB:", sessionRow.userId);
                        }
                    } else {
                        console.log("[Auth Middleware] Session not found in DB for token");
                    }
                } catch (e) {
                    console.error("[Auth Middleware] Error getting session from DB:", e);
                }
            }
        } else {
            console.log("[Auth Middleware] Session found from headers");
        }

        if (session && "user" in session && session.user) {
            req.session = session;
            req.userId = session.user.id;
            console.log("[Auth Middleware] User authenticated:", session.user.id);
        } else {
            console.log("[Auth Middleware] No session found for request:", req.path);
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
