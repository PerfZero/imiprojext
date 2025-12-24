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

