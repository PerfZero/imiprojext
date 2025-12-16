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
import { errorHandler } from "./utils/errorHandler";

// создание акка админа для тестов
export async function createAdminIfNotExists() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.warn(
            "⚠️ ADMIN_PASSWORD не установлен в env, пропускаю создание админа"
        );
        return;
    }

    try {
        // Создаем администратора
        const { user } = await auth.api.createUser({
            body: {
                email: adminEmail,
                password: adminPassword,
                name: "Admin",
                phone: "+7991151565",
                role: "admin",
                data: { phone: "+7991151565" },
            },
        });

        console.log(`✅ Администратор создан: ${user.id}`);
    } catch (error) {
        console.error("❌ Ошибка при создании админа:", error);
    }
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

        if (session) {
            req.session = session;
            req.userId = session?.user?.id;
        }
        next();
    });

    app.use("/api/users", userRouter);
    app.use("/api/wallet", walletRouter);
    app.use("/api/transactions", transactionRouter);
    app.use("/api/notifications", notificationRouter);

    app.use(errorHandler);
    return server;
}
