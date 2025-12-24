function getApiBaseUrl() {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    if (window.Capacitor?.isNativePlatform()) {
        return 'http://79.174.77.143:3000';
    }
    
    return '';
}

export const API_BASE_URL = getApiBaseUrl();

