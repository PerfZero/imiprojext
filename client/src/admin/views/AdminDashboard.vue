<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import StatsCard from "../components/StatsCard.vue";
import adminService from "../adminService";

const stats = ref({
    users: 0,
    transactions: 0,
    totalBalance: 0,
    notifications: 0,
});
const loading = ref(true);

onMounted(async () => {
    try {
        stats.value = await adminService.getStats();
    } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Дашборд</h4>
        </div>

        <div class="row g-4">
            <div class="col-md-6 col-xl-3">
                <StatsCard
                    title="Пользователи"
                    :value="stats.users"
                    icon="bi bi-people"
                    color="primary"
                    :loading="loading"
                />
            </div>
            <div class="col-md-6 col-xl-3">
                <StatsCard
                    title="Транзакции"
                    :value="stats.transactions"
                    icon="bi bi-arrow-left-right"
                    color="success"
                    :loading="loading"
                />
            </div>
            <div class="col-md-6 col-xl-3">
                <StatsCard
                    title="Общий баланс"
                    :value="stats.totalBalance?.toLocaleString('ru', { minimumFractionDigits: 2 })"
                    icon="bi bi-wallet2"
                    color="warning"
                    :loading="loading"
                />
            </div>
            <div class="col-md-6 col-xl-3">
                <StatsCard
                    title="Уведомления"
                    :value="stats.notifications"
                    icon="bi bi-bell"
                    color="info"
                    :loading="loading"
                />
            </div>
        </div>

        <div class="row mt-4 g-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white">
                        <h6 class="mb-0">Быстрые действия</h6>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <router-link to="/admin/users" class="btn btn-outline-primary w-100">
                                    <i class="bi bi-people me-2"></i>Управление пользователями
                                </router-link>
                            </div>
                            <div class="col-md-3">
                                <router-link to="/admin/referrals" class="btn btn-outline-info w-100">
                                    <i class="bi bi-diagram-3 me-2"></i>Реферальная программа
                                </router-link>
                            </div>
                            <div class="col-md-3">
                                <router-link to="/admin/transactions" class="btn btn-outline-success w-100">
                                    <i class="bi bi-arrow-left-right me-2"></i>Просмотр транзакций
                                </router-link>
                            </div>
                            <div class="col-md-3">
                                <router-link to="/admin/wallets" class="btn btn-outline-warning w-100">
                                    <i class="bi bi-wallet2 me-2"></i>Управление кошельками
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>



