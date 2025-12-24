import { createAuthClient } from "better-auth/vue";
import { saveSessionToken, getSessionToken, clearSessionToken, isNativePlatform } from "@/utils/sessionStorage";

function getApiBaseUrl() {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
        return 'http://79.174.77.143:3000';
    }
    
    return "";
}

const baseAuthClient = createAuthClient({
    baseURL: getApiBaseUrl(),
    basePath: "/api/auth",
});

// Создаем функцию выхода с очисткой токена
export async function signOutWithClear(options?: any) {
    console.log('[Auth] Signing out, clearing token...');
    await clearSessionToken();
    return baseAuthClient.signOut(options);
}

// Экспортируем клиент с дополнительными методами
export const authClient = Object.assign(baseAuthClient, {
    getSessionToken,
    saveSessionToken,
    clearSessionToken,
    signOutWithClear,
});
