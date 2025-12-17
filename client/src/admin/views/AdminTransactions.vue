<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import adminService from "../adminService";

const transactions = ref([]);
const pagination = ref(null);
const loading = ref(true);
const typeFilter = ref("");

const columns = [
    { key: "id", label: "ID", width: "80px" },
    { key: "userId", label: "User ID" },
    { key: "currency", label: "Валюта" },
    { key: "amount", label: "Сумма", type: "currency" },
    {
        key: "type",
        label: "Тип",
        type: "badge",
        badgeClass: (item) => {
            const colors = {
                deposit: "bg-success",
                withdraw: "bg-danger",
                transfer: "bg-primary",
                bonus: "bg-warning",
            };
            return colors[item.type] || "bg-secondary";
        },
    },
    { key: "createdAt", label: "Дата", type: "date" },
];

const loadTransactions = async (page = 1) => {
    loading.value = true;
    try {
        const params = { page, limit: 20 };
        if (typeFilter.value) params.type = typeFilter.value;
        const result = await adminService.getTransactions(params);
        transactions.value = result.data;
        pagination.value = result.pagination;
    } catch (error) {
        console.error("Ошибка загрузки транзакций:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => loadTransactions());
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Транзакции</h4>
            <div class="d-flex gap-2">
                <select class="form-select" style="width: 200px" v-model="typeFilter" @change="loadTransactions(1)">
                    <option value="">Все типы</option>
                    <option value="deposit">Пополнение</option>
                    <option value="withdraw">Вывод</option>
                    <option value="transfer">Перевод</option>
                    <option value="bonus">Бонус</option>
                </select>
            </div>
        </div>

        <DataTable
            :columns="columns"
            :data="transactions"
            :pagination="pagination"
            :loading="loading"
            @page-change="loadTransactions"
        />
    </AdminLayout>
</template>


