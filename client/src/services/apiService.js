// apiService.js

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${endpoint}`;

        const config = {
            credentials: 'include',
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

    async getMyReferrals() {
        return this.request("/api/users/my-referrals", {
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

    async transferByCard(data) {
        return this.request("/api/wallet/transfer-by-card", {
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
            credentials: 'include',
            body: formData,
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

    async getCategories() {
        return this.request("/api/products/categories", {
            method: "GET",
        });
    }

    async getProducts(categoryId) {
        const url = categoryId
            ? `/api/products?categoryId=${categoryId}`
            : "/api/products";
        return this.request(url, {
            method: "GET",
        });
    }

    async getProduct(id) {
        return this.request(`/api/products/${id}`, {
            method: "GET",
        });
    }

    async createProduct(data) {
        return this.request("/api/products", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateProduct(id, data) {
        return this.request(`/api/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteProduct(id) {
        return this.request(`/api/products/${id}`, {
            method: "DELETE",
        });
    }

    async createCategory(data) {
        return this.request("/api/products/categories", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateCategory(id, data) {
        return this.request(`/api/products/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteCategory(id) {
        return this.request(`/api/products/categories/${id}`, {
            method: "DELETE",
        });
    }

    async getAttributes() {
        return this.request("/api/products/attributes/list", {
            method: "GET",
        });
    }

    async createAttribute(data) {
        return this.request("/api/products/attributes", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async deleteAttribute(id) {
        return this.request(`/api/products/attributes/${id}`, {
            method: "DELETE",
        });
    }

    async getAttributeValues(attributeId) {
        return this.request(`/api/products/attributes/${attributeId}/values`, {
            method: "GET",
        });
    }

    async createAttributeValue(data) {
        return this.request("/api/products/attributes/values", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async deleteAttributeValue(id) {
        return this.request(`/api/products/attributes/values/${id}`, {
            method: "DELETE",
        });
    }

    async createProductVariant(data) {
        return this.request("/api/products/variants", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async deleteProductVariant(id) {
        return this.request(`/api/products/variants/${id}`, {
            method: "DELETE",
        });
    }

    async setProductAttributes(productId, attributeValueIds) {
        return this.request(`/api/products/${productId}/attributes`, {
            method: "PUT",
            body: JSON.stringify({ attributeValueIds }),
        });
    }

    async getProductImages(productId) {
        return this.request(`/api/products/${productId}/images`, {
            method: "GET",
        });
    }

    async addProductImage(productId, url, isMain = false) {
        return this.request(`/api/products/${productId}/images`, {
            method: "POST",
            body: JSON.stringify({ url, isMain }),
        });
    }

    async setMainImage(imageId) {
        return this.request(`/api/products/images/${imageId}/main`, {
            method: "PUT",
        });
    }

    async deleteProductImage(imageId) {
        return this.request(`/api/products/images/${imageId}`, {
            method: "DELETE",
        });
    }

    async uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload/image", {
            method: "POST",
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Ошибка загрузки файла");
        }

        return response.json();
    }

    async uploadVerificationDocuments(files) {
        const formData = new FormData();
        formData.append("passportPage1", files.passportPage1);
        formData.append("passportPage2", files.passportPage2);
        formData.append("selfieWithPassport", files.selfieWithPassport);

        const response = await fetch("/api/verification/upload", {
            method: "POST",
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { error: errorText };
            }
            const apiError = new Error(`HTTP error! status: ${response.status}`);
            apiError.error = errorData.error;
            throw apiError;
        }

        return response.json();
    }

    async getVerificationStatus() {
        return this.request("/api/verification/status", {
            method: "GET",
        });
    }

    async getUserVerification(userId) {
        return this.request(`/api/verification/${userId}`, {
            method: "GET",
        });
    }

    async getCart() {
        return this.request("/api/cart", {
            method: "GET",
        });
    }

    async addToCart(productId, quantity = 1) {
        return this.request("/api/cart/add", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
        });
    }

    async updateCartItem(id, quantity) {
        return this.request(`/api/cart/${id}`, {
            method: "PUT",
            body: JSON.stringify({ quantity }),
        });
    }

    async removeFromCart(id) {
        return this.request(`/api/cart/${id}`, {
            method: "DELETE",
        });
    }

    async clearCart() {
        return this.request("/api/cart", {
            method: "DELETE",
        });
    }

    async getOrders() {
        return this.request("/api/orders", {
            method: "GET",
        });
    }

    async getAllOrders() {
        return this.request("/api/orders/all", {
            method: "GET",
        });
    }

    async getOrder(id) {
        return this.request(`/api/orders/${id}`, {
            method: "GET",
        });
    }

    async createOrder(data) {
        return this.request("/api/orders", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateOrderStatus(id, status) {
        return this.request(`/api/orders/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({ status }),
        });
    }

    async deleteOrder(id) {
        return this.request(`/api/orders/${id}`, {
            method: "DELETE",
        });
    }

    async validateCoupon(code, totalAmount) {
        return this.request("/api/coupons/validate", {
            method: "POST",
            body: JSON.stringify({ code, totalAmount }),
        });
    }

    async getCoupons() {
        return this.request("/api/coupons", {
            method: "GET",
        });
    }

    async createCoupon(data) {
        return this.request("/api/coupons", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateCoupon(id, data) {
        return this.request(`/api/coupons/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteCoupon(id) {
        return this.request(`/api/coupons/${id}`, {
            method: "DELETE",
        });
    }

    async getAddresses() {
        return this.request("/api/users/addresses", {
            method: "GET",
        });
    }

    async createAddress(data) {
        return this.request("/api/users/addresses", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateAddress(id, data) {
        return this.request(`/api/users/addresses/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    async deleteAddress(id) {
        return this.request(`/api/users/addresses/${id}`, {
            method: "DELETE",
        });
    }
}

export default new ApiService();
