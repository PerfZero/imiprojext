<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import adminService from "../adminService";

const notifications = ref([]);
const pagination = ref(null);
const loading = ref(true);

const columns = [
    { key: "id", label: "ID", width: "80px" },
    { key: "userId", label: "User ID" },
    { key: "category", label: "Категория" },
    { key: "subcategory", label: "Подкатегория" },
    { key: "message", label: "Сообщение" },
    {
        key: "is_read",
        label: "Прочитано",
        type: "badge",
        render: (item) => (item.is_read ? "Да" : "Нет"),
        badgeClass: (item) => (item.is_read ? "bg-success" : "bg-secondary"),
    },
    { key: "createdAt", label: "Дата", type: "date" },
];

const loadNotifications = async (page = 1) => {
    loading.value = true;
    try {
        const result = await adminService.getNotifications({ page, limit: 20 });
        notifications.value = result.data;
        pagination.value = result.pagination;
    } catch (error) {
        console.error("Ошибка загрузки уведомлений:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => loadNotifications());
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Уведомления</h4>
        </div>

        <DataTable
            :columns="columns"
            :data="notifications"
            :pagination="pagination"
            :loading="loading"
            @page-change="loadNotifications"
        />
    </AdminLayout>
</template>





