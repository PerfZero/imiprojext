import { Server } from "http";
import WebSocket from "ws";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";
import { IncomingMessage } from "http";

const clients = new Map<string, WebSocket>();
let wss: WebSocket.Server | null = null;

async function getUserFromSession(sessionToken: string) {
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
    wss = new WebSocket.Server({ server, path: "/socket" });
    console.log("WebSocket сервер запущен на пути /socket");

    wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
        console.log("Новое WebSocket подключение");
        let userId = null;
        let token = null;

        try {
            let session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });
            console.log("[WS] Session from headers:", !!session);

            if (!session) {
                const url = new URL(req.url || "", `http://${req.headers.host}`);
                const queryToken = url.searchParams.get("token");
                console.log("[WS] Token from query:", queryToken);
                
                if (queryToken) {
                    // Пробуем разные форматы
                    session = await auth.api.getSession({
                        headers: {
                            cookie: `better-auth.session_token=${queryToken}`,
                        },
                    });
                    console.log("[WS] Session with cookie format:", !!session);
                    
                    if (!session) {
                        // Пробуем с URL-encoded именем
                        session = await auth.api.getSession({
                            headers: {
                                cookie: `better-auth%2Esession_token=${queryToken}`,
                            },
                        });
                        console.log("[WS] Session with encoded cookie:", !!session);
                    }
                }
            }

            if (session && session.user) {
                userId = session.user?.id;
                token = session.session?.token;

                clients.set(userId, ws);
                console.log(`WebSocket подключен для пользователя: ${userId}`);

                ws.send(
                    JSON.stringify({
                        type: "auth_success",
                        userId: userId,
                    })
                );
            } else {
                console.log("WebSocket: сессия не найдена");
                ws.send(
                    JSON.stringify({
                        type: "auth_error",
                        message: "Неверный токен",
                    })
                );
                ws.close();
            }
        } catch (error) {
            console.error("WebSocket ошибка авторизации:", error);
            ws.send(
                JSON.stringify({
                    type: "auth_error",
                    message: "Ошибка авторизации",
                })
            );
            ws.close();
        }

        ws.on("message", async (message: WebSocket.Data) => {
            try {
                const messageStr = message.toString();
                const data = JSON.parse(messageStr);
            } catch (error) {
                console.error("Ошибка обработки сообщения:", error);
            }
        });

        ws.on("close", () => {
            if (userId) {
                clients.delete(userId);
            }
        });

        ws.on("error", (error: Error) => {
            console.error("WebSocket ошибка:", error);
        });
    });
}

// Функция для отправки уведомления конкретному пользователю
export function sendNotificationToUser(userId: string | null | undefined, notification: any) {
    if (!userId) {
        return false;
    }
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
