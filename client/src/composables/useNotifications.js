// composables/useNotifications.js
import { ref, onMounted, onUnmounted } from "vue";
import apiService from "@/services/apiService";
import { getSessionToken, loadSessionToken, isNativePlatform } from "@/utils/sessionStorage";

const notifications = ref([]);
let ws = null;
let reconnectTimeout = null;
const RECONNECT_DELAY = 3000;

const subscribers = [];

export function useNotifications() {
    const loadInitialNotifications = async () => {
        try {
            notifications.value = await apiService.getNotifications();
        } catch (error) {
            console.error("Ошибка загрузки уведомлений:", error);
        }
    };

    const onNotify = (cb) => {
        subscribers.push(cb);
    };

    const connectWebSocket = async () => {
        if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
            return;
        }

        let wsUrl;
        if (isNativePlatform()) {
            const apiBaseUrl = 'http://79.174.77.143:3000';
            // Убедимся, что токен загружен из Preferences
            let token = getSessionToken();
            if (!token) {
                token = await loadSessionToken();
            }
            console.log("[WS] Native platform, token:", token ? token.substring(0, 20) + "..." : "null");
            wsUrl = apiBaseUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/socket';
            if (token) {
                wsUrl += `?token=${encodeURIComponent(token)}`;
            } else {
                console.warn("[WS] No token available, WebSocket may fail to authenticate");
            }
        } else {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const host = window.location.host;
            wsUrl = `${protocol}//${host}/socket`;
        }
        
        console.log("Подключение к WebSocket:", wsUrl);
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket подключен");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WebSocket сообщение получено:", data);

                if (data.type === "auth_success") {
                    console.log("WebSocket авторизация успешна");
                } else if (data.type === "auth_error") {
                    console.error("WebSocket ошибка авторизации:", data.message);
                    ws.close();
                    return;
                }

                subscribers.forEach((item) => {
                    item(data);
                });

                if (data.type === "new_notification") {
                    const exists = notifications.value.some(
                        (n) => n.id === data.notification.id
                    );
                    if (!exists) {
                        notifications.value.unshift(data.notification);
                    }
                }
            } catch (error) {
                console.error("Ошибка парсинга сообщения:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket ошибка:", error);
        };

        ws.onclose = () => {
            console.log(
                "WebSocket отключен, переподключение через",
                RECONNECT_DELAY,
                "мс"
            );

            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }

            reconnectTimeout = setTimeout(async () => {
                await connectWebSocket();
            }, RECONNECT_DELAY);
        };
    };

    /* const markAsRead = async (notificationId) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: "PATCH",
            });

            const notification = notifications.value.find(
                (n) => n.id === notificationId
            );
            if (notification) {
                notification.is_read = true;
            }
        } catch (error) {
            console.error("Ошибка отметки уведомления:", error);
        }
    }; */

    const markAsReadAll = async () => {
        try {
            await apiService.markAsReadAll();
            await loadInitialNotifications();
        } catch (error) {
            console.error("Ошибка отметки уведомления:", error);
        }
    };

    const disconnect = () => {
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
        }
        if (ws) {
            ws.close();
            ws = null;
        }
    };

    onMounted(async () => {
        await loadInitialNotifications();
        await connectWebSocket();
    });

    onUnmounted(() => {
        disconnect();
    });

    return {
        onNotify,
        notifications,
        markAsReadAll,
        disconnect,
    };
}
