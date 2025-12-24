import { ref, computed } from 'vue';
import { authClient } from '@/lib/auth-client';
import { isNativePlatform, loadSessionToken, getSessionToken } from '@/utils/sessionStorage';
import { API_BASE_URL } from '@/utils/apiConfig';

// Глобальное состояние пользователя
const user = ref(null);
const isLoading = ref(false);
const isInitialized = ref(false);

export function useUser() {
    const session = authClient.useSession();
    
    // Для веб-версии используем session из better-auth
    const currentUser = computed(() => {
        if (!isNativePlatform()) {
            return session.data?.value?.user || null;
        }
        return user.value;
    });
    
    const isAuthenticated = computed(() => {
        return !!currentUser.value;
    });
    
    // Загрузка данных пользователя для мобильного
    async function loadUser() {
        if (!isNativePlatform()) {
            return session.data?.value?.user;
        }
        
        isLoading.value = true;
        try {
            const token = getSessionToken() || await loadSessionToken();
            if (!token) {
                user.value = null;
                return null;
            }
            
            const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            const data = await response.json();
            if (data && data.user) {
                user.value = data.user;
                console.log('[useUser] User loaded:', data.user.email);
                return data.user;
            } else {
                user.value = null;
                return null;
            }
        } catch (error) {
            console.error('[useUser] Error loading user:', error);
            user.value = null;
            return null;
        } finally {
            isLoading.value = false;
            isInitialized.value = true;
        }
    }
    
    // Установка пользователя (после логина)
    function setUser(userData) {
        user.value = userData;
        console.log('[useUser] User set:', userData?.email);
    }
    
    // Очистка пользователя (после логаута)
    function clearUser() {
        user.value = null;
        console.log('[useUser] User cleared');
    }
    
    // Инициализация при первом использовании
    if (isNativePlatform() && !isInitialized.value && !isLoading.value) {
        loadUser();
    }
    
    return {
        user: currentUser,
        isAuthenticated,
        isLoading,
        loadUser,
        setUser,
        clearUser,
        // Для совместимости со старым кодом
        session: computed(() => ({
            data: {
                value: {
                    user: currentUser.value,
                }
            }
        })),
    };
}

// Глобальные функции для установки/очистки пользователя
export function globalSetUser(userData) {
    user.value = userData;
    console.log('[useUser] User set globally:', userData?.email);
}

export function globalClearUser() {
    user.value = null;
    console.log('[useUser] User cleared globally');
}

