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

export const authClient = baseAuthClient as typeof baseAuthClient & {
    getSessionToken: typeof getSessionToken;
    saveSessionToken: typeof saveSessionToken;
    clearSessionToken: typeof clearSessionToken;
};

authClient.getSessionToken = getSessionToken;
authClient.saveSessionToken = saveSessionToken;
authClient.clearSessionToken = clearSessionToken;
