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

// Базовый URL сайта для реферальных ссылок
function getSiteBaseUrl() {
    if (import.meta.env.VITE_SITE_URL) {
        return import.meta.env.VITE_SITE_URL;
    }
    
    // Для мобильного приложения используем реальный URL сайта
    if (window.Capacitor?.isNativePlatform()) {
        return 'http://79.174.77.143:3000';
    }
    
    // Для веб-версии используем текущий origin
    return window.location.origin;
}

export const SITE_BASE_URL = getSiteBaseUrl();

// Преобразует относительный путь картинки в полный URL для мобильного приложения
export function getImageUrl(imagePath) {
    if (!imagePath) return '';
    
    // Если уже полный URL — вернуть как есть
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Для мобильного приложения добавляем базовый URL сервера
    if (window.Capacitor?.isNativePlatform()) {
        return `${API_BASE_URL}${imagePath}`;
    }
    
    // Для веб-версии возвращаем как есть (работает через прокси)
    return imagePath;
}

