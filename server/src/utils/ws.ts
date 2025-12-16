const WebSocket = require("ws");
import { fromNodeHeaders } from "better-auth/node";
import { auth, authHandler } from "./auth";

// Храним подключения пользователей: userId -> WebSocket
const clients = new Map();
let wss;

// Middleware для проверки сессии через better-auth
async function getUserFromSession(sessionToken) {
    try {
        // better-auth хранит сессии, получаем пользователя по токену
        const session = await auth.api.getSession({
            headers: {
                cookie: `better-auth.session_token=${sessionToken}`,
            },
        });

        return session?.user;
    } catch (error) {
        console.error("Ошибка проверки сессии:", error);
        return null;
    }
}

export function createWebSocketServer(server: Server) {
    wss = new WebSocket.Server({ server });

    // WebSocket connection handler
    wss.on("connection", async (ws, req) => {
        let userId = null;
        let token = null;

        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (session && session.user) {
            userId = session.user?.id;
            token = session.session?.token;

            clients.set(userId, ws);

            // Отправляем подтверждение
            ws.send(
                JSON.stringify({
                    type: "auth_success",
                    userId: userId,
                })
            );
        } else {
            ws.send(
                JSON.stringify({
                    type: "auth_error",
                    message: "Неверный токен",
                })
            );
            ws.close();
        }

        ws.on("message", async (message) => {
            try {
                const data = JSON.parse(message);
            } catch (error) {
                console.error("Ошибка обработки сообщения:", error);
            }
        });

        ws.on("close", () => {
            if (userId) {
                clients.delete(userId);
            }
        });

        ws.on("error", (error) => {
            console.error("WebSocket ошибка:", error);
        });
    });
}

// Функция для отправки уведомления конкретному пользователю
export function sendNotificationToUser(userId, notification) {
    const userWs = clients.get(userId);
    if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(
            JSON.stringify({
                type: "new_notification",
                notification: notification,
            })
        );
        return true;
    }
    return false;
}
