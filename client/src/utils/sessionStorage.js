const SESSION_KEY = 'imi_session_token';

export function saveSessionToken(token) {
    if (token) {
        localStorage.setItem(SESSION_KEY, token);
    }
}

export function getSessionToken() {
    return localStorage.getItem(SESSION_KEY);
}

export function clearSessionToken() {
    localStorage.removeItem(SESSION_KEY);
}

export function isNativePlatform() {
    return window.Capacitor?.isNativePlatform() || false;
}

