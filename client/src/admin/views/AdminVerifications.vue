<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import adminService from "../adminService";

const verifications = ref([]);
const pagination = ref(null);
const loading = ref(true);
const statusFilter = ref("");
const selectedVerification = ref(null);
const showModal = ref(false);
const rejectionReason = ref("");

const columns = [
    { key: "id", label: "ID", width: "80px" },
    {
        key: "user",
        label: "Пользователь",
        render: (item) => item.user ? `${item.user.name} (${item.user.email})` : "N/A",
    },
    {
        key: "status",
        label: "Статус",
        type: "badge",
        badgeClass: (item) => {
            if (item.status === "approved") return "bg-success";
            if (item.status === "rejected") return "bg-danger";
            return "bg-warning";
        },
        render: (item) => {
            if (item.status === "approved") return "Одобрено";
            if (item.status === "rejected") return "Отклонено";
            return "На проверке";
        },
    },
    {
        key: "createdAt",
        label: "Дата загрузки",
        type: "date",
    },
    {
        key: "reviewedAt",
        label: "Дата проверки",
        type: "date",
        render: (item) => item.reviewedAt || "-",
    },
    {
        key: "actions",
        label: "Действия",
        type: "actions",
        width: "150px",
        actions: [
            { name: "view", icon: "bi bi-eye", class: "btn-outline-primary", label: "Просмотр" },
            { name: "approve", icon: "bi bi-check", class: "btn-outline-success", label: "Одобрить" },
            { name: "reject", icon: "bi bi-x", class: "btn-outline-danger", label: "Отклонить" },
        ],
    },
];

const loadVerifications = async (page = 1) => {
    loading.value = true;
    try {
        const params = { page, limit: 20 };
        if (statusFilter.value) params.status = statusFilter.value;
        const result = await adminService.getVerifications(params);
        verifications.value = result.data;
        pagination.value = result.pagination;
    } catch (error) {
        console.error("Ошибка загрузки верификаций:", error);
    } finally {
        loading.value = false;
    }
};

const handleAction = async ({ action, item }) => {
    if (action === "view") {
        selectedVerification.value = item;
        showModal.value = true;
    } else if (action === "approve") {
        if (confirm(`Одобрить верификацию пользователя ${item.user?.name || item.userId}?`)) {
            try {
                await adminService.approveVerification(item.id);
                showModal.value = false;
                loadVerifications(pagination.value?.page || 1);
            } catch (error) {
                alert("Ошибка одобрения верификации");
            }
        }
    } else if (action === "reject") {
        selectedVerification.value = item;
        rejectionReason.value = "";
        showModal.value = true;
    }
};

const rejectVerification = async () => {
    if (!rejectionReason.value.trim()) {
        alert("Укажите причину отклонения");
        return;
    }

    try {
        await adminService.rejectVerification(selectedVerification.value.id, rejectionReason.value);
        showModal.value = false;
        rejectionReason.value = "";
        loadVerifications(pagination.value?.page || 1);
    } catch (error) {
        alert("Ошибка отклонения верификации");
    }
};

onMounted(() => loadVerifications());
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Верификации</h4>
            <div class="d-flex gap-2">
                <select v-model="statusFilter" @change="loadVerifications(1)" class="form-select" style="width: auto">
                    <option value="">Все статусы</option>
                    <option value="pending">На проверке</option>
                    <option value="approved">Одобрено</option>
                    <option value="rejected">Отклонено</option>
                </select>
            </div>
        </div>

        <DataTable
            :columns="columns"
            :data="verifications"
            :pagination="pagination"
            :loading="loading"
            @page-change="loadVerifications"
            @action="handleAction"
        />

        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Просмотр документов верификации</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="selectedVerification?.user" class="mb-3">
                            <p><strong>Пользователь:</strong> {{ selectedVerification.user.name }}</p>
                            <p><strong>Email:</strong> {{ selectedVerification.user.email }}</p>
                            <p><strong>Статус:</strong> 
                                <span class="badge" :class="{
                                    'bg-warning': selectedVerification.status === 'pending',
                                    'bg-success': selectedVerification.status === 'approved',
                                    'bg-danger': selectedVerification.status === 'rejected'
                                }">
                                    {{ selectedVerification.status === 'pending' ? 'На проверке' : 
                                       selectedVerification.status === 'approved' ? 'Одобрено' : 'Отклонено' }}
                                </span>
                            </p>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-12 col-md-4">
                                <label class="form-label">Первая страница паспорта</label>
                                <div v-if="selectedVerification?.passportPage1Url">
                                    <img :src="selectedVerification.passportPage1Url" alt="Passport page 1" class="img-fluid rounded border">
                                </div>
                                <div v-else class="text-muted">Не загружено</div>
                            </div>
                            <div class="col-12 col-md-4">
                                <label class="form-label">Вторая страница паспорта</label>
                                <div v-if="selectedVerification?.passportPage2Url">
                                    <img :src="selectedVerification.passportPage2Url" alt="Passport page 2" class="img-fluid rounded border">
                                </div>
                                <div v-else class="text-muted">Не загружено</div>
                            </div>
                            <div class="col-12 col-md-4">
                                <label class="form-label">Селфи с паспортом</label>
                                <div v-if="selectedVerification?.selfieWithPassportUrl">
                                    <img :src="selectedVerification.selfieWithPassportUrl" alt="Selfie with passport" class="img-fluid rounded border">
                                </div>
                                <div v-else class="text-muted">Не загружено</div>
                            </div>
                        </div>

                        <div v-if="selectedVerification?.status === 'rejected' && selectedVerification?.rejectionReason" class="alert alert-danger">
                            <strong>Причина отклонения:</strong> {{ selectedVerification.rejectionReason }}
                        </div>

                        <div v-if="selectedVerification?.status === 'pending'">
                            <div class="mb-3">
                                <label class="form-label">Причина отклонения (если отклоняете)</label>
                                <textarea 
                                    v-model="rejectionReason" 
                                    class="form-control" 
                                    rows="3"
                                    placeholder="Укажите причину отклонения верификации"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">Закрыть</button>
                        <template v-if="selectedVerification?.status === 'pending'">
                            <button 
                                type="button" 
                                class="btn btn-success" 
                                @click="handleAction({ action: 'approve', item: selectedVerification })"
                            >
                                Одобрить
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-danger" 
                                @click="rejectVerification"
                                :disabled="!rejectionReason.trim()"
                            >
                                Отклонить
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>







