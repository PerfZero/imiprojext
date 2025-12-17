// apiService.js

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${endpoint}`;

        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };
        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Пытаемся получить текст ошибки из ответа сервера
                const errorText = await response.text();
                let errorData;

                try {
                    // Пробуем распарсить как JSON
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    // Если не JSON, используем как текст ошибки
                    errorData = { error: errorText };
                }

                // Создаем ошибку с дополнительным полем error
                const apiError = new Error(
                    `HTTP error! status: ${response.status}`
                );
                apiError.error = errorData.error;
                throw apiError;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }

    async getUserReferrer() {
        return this.request("/api/users/referrer", {
            method: "GET",
        });
    }

    // Получение балансов пользователя
    async getUserBalances() {
        return this.request("/api/users/balances", {
            method: "GET",
        });
    }

    // Получение балансов пользователя
    async getIncomeByLevel() {
        return this.request("/api/transactions/incomeByLevel", {
            method: "GET",
        });
    }

    // Получение балансов пользователя
    async getTransactions() {
        return this.request("/api/transactions", {
            method: "GET",
        });
    }

    async walletConvert(data) {
        return this.request("/api/wallet/convert", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async walletDeposit(data) {
        return this.request("/api/wallet/deposit", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    async walletWithdraw(data) {
        return this.request("/api/wallet/withdraw", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async walletPurchase(data) {
        return this.request("/api/wallet/purchase", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    // Загрузка аватарки пользователя
    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append("avatar", file);

        const config = {
            method: "POST",
            body: formData,
            // Убираем Content-Type заголовок, чтобы браузер установил его автоматически с boundary
        };
        try {
            const response = await fetch("/api/users/avatar", config);

            if (!response.ok) {
                // Пытаемся получить текст ошибки из ответа сервера
                const errorText = await response.text();
                let errorData;

                try {
                    // Пробуем распарсить как JSON
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    // Если не JSON, используем как текст ошибки
                    errorData = { error: errorText };
                }

                // Создаем ошибку с дополнительным полем error
                const apiError = new Error(
                    `HTTP error! status: ${response.status}`
                );
                apiError.error = errorData.error;
                throw apiError;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Upload avatar failed:", error);
            throw error;
        }
    }

    // Notifications

    async getNotifications() {
        return this.request("/api/notifications", {
            method: "GET",
        });
    }

    async markAsReadAll() {
        return this.request("/api/notifications/markAsReadAll", {
            method: "POST",
        });
    }

    async getSession() {
        return this.request("/api/auth/get-session", {
            method: "GET",
        });
    }
}

// Экспортируем единственный экземпляр сервиса
export default new ApiService();
