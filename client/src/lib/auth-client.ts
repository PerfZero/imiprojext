import { createAuthClient } from "better-auth/vue";

function getApiBaseUrl() {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform()) {
        return 'http://79.174.77.143:3000';
    }
    
    return "";
}

export const authClient = createAuthClient({
    baseURL: getApiBaseUrl(),
    basePath: "/api/auth",
});
