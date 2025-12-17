<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import adminService from "../adminService";

const wallets = ref([]);
const pagination = ref(null);
const loading = ref(true);
const selectedWallet = ref(null);
const showModal = ref(false);

const columns = [
    { key: "id", label: "ID", width: "80px" },
    { key: "userName", label: "Пользователь" },
    { key: "userEmail", label: "Email" },
    { key: "currency", label: "Валюта" },
    { key: "balance", label: "Баланс", type: "currency" },
    {
        key: "actions",
        label: "Действия",
        type: "actions",
        width: "100px",
        actions: [
            { name: "edit", icon: "bi bi-pencil", class: "btn-outline-primary", label: "Изменить баланс" },
        ],
    },
];

const loadWallets = async (page = 1) => {
    loading.value = true;
    try {
        const result = await adminService.getWallets({ page, limit: 20 });
        wallets.value = result.data;
        pagination.value = result.pagination;
    } catch (error) {
        console.error("Ошибка загрузки кошельков:", error);
    } finally {
        loading.value = false;
    }
};

const handleAction = ({ action, item }) => {
    if (action === "edit") {
        selectedWallet.value = { ...item };
        showModal.value = true;
    }
};

const saveWallet = async () => {
    try {
        await adminService.updateWallet(selectedWallet.value.id, {
            balance: parseFloat(selectedWallet.value.balance),
        });
        showModal.value = false;
        loadWallets(pagination.value?.page || 1);
    } catch (error) {
        alert("Ошибка сохранения");
    }
};

onMounted(() => loadWallets());
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Кошельки</h4>
        </div>

        <DataTable
            :columns="columns"
            :data="wallets"
            :pagination="pagination"
            :loading="loading"
            @page-change="loadWallets"
            @action="handleAction"
        />

        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Изменить баланс</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Пользователь</label>
                            <input type="text" class="form-control" :value="selectedWallet.userName" disabled />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Валюта</label>
                            <input type="text" class="form-control" :value="selectedWallet.currency" disabled />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Баланс</label>
                            <input type="number" step="0.01" class="form-control" v-model="selectedWallet.balance" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">Отмена</button>
                        <button type="button" class="btn btn-primary" @click="saveWallet">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

