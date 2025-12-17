import apiService from "@/services/apiService";

const adminService = {
    async getStats() {
        return apiService.request("/api/admin/stats");
    },

    async getUsers(params = {}) {
        const query = new URLSearchParams(params).toString();
        return apiService.request(`/api/admin/users?${query}`);
    },

    async getUser(id) {
        return apiService.request(`/api/admin/users/${id}`);
    },

    async updateUser(id, data) {
        return apiService.request(`/api/admin/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async deleteUser(id) {
        return apiService.request(`/api/admin/users/${id}`, {
            method: "DELETE",
        });
    },

    async getTransactions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return apiService.request(`/api/admin/transactions?${query}`);
    },

    async getWallets(params = {}) {
        const query = new URLSearchParams(params).toString();
        return apiService.request(`/api/admin/wallets?${query}`);
    },

    async updateWallet(id, data) {
        return apiService.request(`/api/admin/wallets/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async getNotifications(params = {}) {
        const query = new URLSearchParams(params).toString();
        return apiService.request(`/api/admin/notifications?${query}`);
    },
};

export default adminService;
