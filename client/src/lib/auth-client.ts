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
    fetchOptions: {
        onSuccess: (ctx: any) => {
            if (isNativePlatform() && ctx.data?.token) {
                saveSessionToken(ctx.data.token);
            }
        },
    },
});

export const authClient = {
    ...baseAuthClient,
    signOut: async () => {
        clearSessionToken();
        return baseAuthClient.signOut();
    },
    getSessionToken,
    saveSessionToken,
    clearSessionToken,
};
