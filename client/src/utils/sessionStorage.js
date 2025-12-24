import { Preferences } from '@capacitor/preferences';

const SESSION_KEY = 'imi_session_token';

// Кэш для синхронного доступа
let tokenCache = null;

export function isNativePlatform() {
    return window.Capacitor?.isNativePlatform() || false;
}

// Асинхронное сохранение токена (для мобильного приложения используем Preferences)
export async function saveSessionToken(token) {
    if (!token) return;
    
    tokenCache = token;
    
    if (isNativePlatform()) {
        try {
            await Preferences.set({ key: SESSION_KEY, value: token });
            console.log('[Session] Token saved to Preferences');
        } catch (e) {
            console.error('[Session] Error saving to Preferences:', e);
            localStorage.setItem(SESSION_KEY, token);
        }
    } else {
        localStorage.setItem(SESSION_KEY, token);
    }
}

// Синхронное получение токена из кэша
export function getSessionToken() {
    if (tokenCache) return tokenCache;
    
    // Fallback на localStorage
    const token = localStorage.getItem(SESSION_KEY);
    if (token) tokenCache = token;
    return token;
}

// Асинхронная загрузка токена при старте приложения
export async function loadSessionToken() {
    if (isNativePlatform()) {
        try {
            const { value } = await Preferences.get({ key: SESSION_KEY });
            if (value) {
                tokenCache = value;
                // Синхронизируем с localStorage для быстрого доступа
                localStorage.setItem(SESSION_KEY, value);
                console.log('[Session] Token loaded from Preferences');
                return value;
            }
        } catch (e) {
            console.error('[Session] Error loading from Preferences:', e);
        }
    }
    
    // Fallback на localStorage
    const token = localStorage.getItem(SESSION_KEY);
    if (token) tokenCache = token;
    return token;
}

// Очистка токена
export async function clearSessionToken() {
    tokenCache = null;
    localStorage.removeItem(SESSION_KEY);
    
    if (isNativePlatform()) {
        try {
            await Preferences.remove({ key: SESSION_KEY });
            console.log('[Session] Token cleared from Preferences');
        } catch (e) {
            console.error('[Session] Error clearing Preferences:', e);
        }
    }
}
