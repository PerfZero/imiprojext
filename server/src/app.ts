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

    app.use(express.json());
    app.use("/static", express.static(path.join(process.cwd(), "public")));
    // Раздача статики напрямую из корня /public (например, /uploads/...)
    app.use(express.static(path.join(process.cwd(), "public")));

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/docs.json", (_req, res) => {
        res.json(swaggerSpec);
    });

    app.all("/api/auth/{*any}", authHandler);
    app.use(async (req, res, next) => {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

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
    app.use("/api/admin", adminRouter);

    app.use(errorHandler);
    return server;
}
