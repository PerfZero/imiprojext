<script setup>
import { ref, onMounted, watch } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import adminService from "../adminService";

const users = ref([]);
const pagination = ref(null);
const loading = ref(true);
const search = ref("");
const selectedUser = ref(null);
const showModal = ref(false);

const columns = [
    { key: "name", label: "Имя" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Телефон" },
    {
        key: "role",
        label: "Роль",
        type: "badge",
        badgeClass: (item) => (item.role === "admin" ? "bg-danger" : "bg-secondary"),
    },
    {
        key: "banned",
        label: "Статус",
        type: "badge",
        render: (item) => (item.banned ? "Заблокирован" : "Активен"),
        badgeClass: (item) => (item.banned ? "bg-danger" : "bg-success"),
    },
    { key: "created_at", label: "Регистрация", type: "date" },
    {
        key: "actions",
        label: "Действия",
        type: "actions",
        width: "120px",
        actions: [
            { name: "edit", icon: "bi bi-pencil", class: "btn-outline-primary", label: "Редактировать" },
            { name: "delete", icon: "bi bi-trash", class: "btn-outline-danger", label: "Удалить" },
        ],
    },
];

const loadUsers = async (page = 1) => {
    loading.value = true;
    try {
        const params = { page, limit: 20 };
        if (search.value) params.search = search.value;
        const result = await adminService.getUsers(params);
        users.value = result.data;
        pagination.value = result.pagination;
    } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
    } finally {
        loading.value = false;
    }
};

const handleAction = async ({ action, item }) => {
    if (action === "edit") {
        selectedUser.value = { ...item };
        showModal.value = true;
    } else if (action === "delete") {
        if (confirm(`Удалить пользователя ${item.name}?`)) {
            try {
                await adminService.deleteUser(item.id);
                loadUsers(pagination.value?.page || 1);
            } catch (error) {
                alert("Ошибка удаления пользователя");
            }
        }
    }
};

const saveUser = async () => {
    try {
        await adminService.updateUser(selectedUser.value.id, {
            name: selectedUser.value.name,
            email: selectedUser.value.email,
            phone: selectedUser.value.phone,
            role: selectedUser.value.role,
            banned: selectedUser.value.banned,
            banReason: selectedUser.value.banReason,
        });
        showModal.value = false;
        loadUsers(pagination.value?.page || 1);
    } catch (error) {
        alert("Ошибка сохранения пользователя");
    }
};

let searchTimeout = null;
watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadUsers(1), 300);
});

onMounted(() => loadUsers());
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Пользователи</h4>
            <div class="d-flex gap-2">
                <div class="input-group" style="width: 300px">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Поиск..."
                        v-model="search"
                    />
                </div>
            </div>
        </div>

        <DataTable
            :columns="columns"
            :data="users"
            :pagination="pagination"
            :loading="loading"
            @page-change="loadUsers"
            @action="handleAction"
        />

        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактирование пользователя</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Имя</label>
                            <input type="text" class="form-control" v-model="selectedUser.name" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" v-model="selectedUser.email" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Телефон</label>
                            <input type="text" class="form-control" v-model="selectedUser.phone" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Роль</label>
                            <select class="form-select" v-model="selectedUser.role">
                                <option value="user">Пользователь</option>
                                <option value="admin">Администратор</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    id="banned"
                                    v-model="selectedUser.banned"
                                />
                                <label class="form-check-label" for="banned">Заблокирован</label>
                            </div>
                        </div>
                        <div class="mb-3" v-if="selectedUser.banned">
                            <label class="form-label">Причина блокировки</label>
                            <textarea class="form-control" v-model="selectedUser.banReason" rows="2"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">Отмена</button>
                        <button type="button" class="btn btn-primary" @click="saveUser">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

