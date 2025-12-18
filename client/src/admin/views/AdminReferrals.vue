<script setup>
import { ref, onMounted, watch } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import adminService from "../adminService";

const referrals = ref([]);
const stats = ref(null);
const pagination = ref(null);
const loading = ref(true);
const search = ref("");
const selectedUser = ref(null);
const showUserDetails = ref(false);
const userDetails = ref(null);

const columns = [
    { key: "name", label: "Имя" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Телефон" },
    { key: "referralCode", label: "Реферальный код" },
    {
        key: "referrer",
        label: "Пригласил",
        render: (item) => {
            if (!item.referrer) return "-";
            return `${item.referrer.name} (${item.referrer.email})`;
        },
    },
    { key: "createdAt", label: "Регистрация", type: "date" },
    {
        key: "actions",
        label: "Действия",
        type: "actions",
        width: "120px",
        actions: [
            { name: "view", icon: "bi bi-eye", class: "btn-outline-info", label: "Детали" },
        ],
    },
];

const loadReferrals = async (page = 1) => {
    loading.value = true;
    try {
        const params = { page, limit: 50 };
        if (search.value) params.search = search.value;
        const result = await adminService.getReferrals(params);
        referrals.value = result.data;
        pagination.value = result.pagination;
    } catch (error) {
        console.error("Ошибка загрузки рефералов:", error);
    } finally {
        loading.value = false;
    }
};

const loadStats = async () => {
    try {
        stats.value = await adminService.getReferralStats();
    } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
    }
};

const handleAction = async ({ action, item }) => {
    if (action === "view") {
        try {
            userDetails.value = await adminService.getUserReferrals(item.id);
            selectedUser.value = item;
            showUserDetails.value = true;
        } catch (error) {
            alert("Ошибка загрузки деталей пользователя");
        }
    }
};

let searchTimeout = null;
watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadReferrals(1), 300);
});

onMounted(() => {
    loadReferrals();
    loadStats();
});
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Реферальная программа</h4>
        </div>

        <div v-if="stats" class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <h6 class="text-muted mb-2">Всего пользователей</h6>
                        <h3 class="mb-0">{{ stats.totalUsers }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <h6 class="text-muted mb-2">С реферером</h6>
                        <h3 class="mb-0 text-success">{{ stats.usersWithReferrers }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <h6 class="text-muted mb-2">Без реферера</h6>
                        <h3 class="mb-0 text-warning">{{ stats.usersWithoutReferrers }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <h6 class="text-muted mb-2">Процент охвата</h6>
                        <h3 class="mb-0">
                            {{
                                stats.totalUsers > 0
                                    ? Math.round((stats.usersWithReferrers / stats.totalUsers) * 100)
                                    : 0
                            }}%
                        </h3>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="stats?.topReferrers?.length > 0" class="card mb-4">
            <div class="card-header">
                <h6 class="mb-0">Топ рефереров</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Место</th>
                                <th>Имя</th>
                                <th>Email</th>
                                <th>Реферальный код</th>
                                <th>Количество рефералов</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ref, index) in stats.topReferrers" :key="ref.id">
                                <td>
                                    <span class="badge bg-primary">#{{ index + 1 }}</span>
                                </td>
                                <td>{{ ref.name }}</td>
                                <td>{{ ref.email }}</td>
                                <td><code>{{ ref.referralCode }}</code></td>
                                <td>
                                    <span class="badge bg-success">{{ ref.referralsCount }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">Все пользователи</h6>
                <div class="d-flex gap-2">
                    <input
                        type="text"
                        class="form-control form-control-sm"
                        style="width: 250px;"
                        v-model="search"
                        placeholder="Поиск по имени, email, телефону, коду..."
                    />
                </div>
            </div>
            <div class="card-body">
                <DataTable
                    :columns="columns"
                    :data="referrals"
                    :pagination="pagination"
                    :loading="loading"
                    @action="handleAction"
                    @page-change="loadReferrals"
                />
            </div>
        </div>

        <Teleport to="body">
            <div
                v-if="showUserDetails && userDetails"
                class="modal fade show"
                style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999;"
                tabindex="-1"
                @click.self="showUserDetails = false"
            >
                <div class="modal-dialog modal-lg modal-dialog-scrollable" style="z-index: 100000; margin: 1.75rem auto;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Детали реферальной структуры</h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showUserDetails = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-4">
                                <h6>Информация о пользователе</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Имя:</strong> {{ userDetails.user.name }}</p>
                                        <p><strong>Email:</strong> {{ userDetails.user.email }}</p>
                                        <p><strong>Телефон:</strong> {{ userDetails.user.phone }}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <p>
                                            <strong>Реферальный код:</strong>
                                            <code>{{ userDetails.user.referralCode }}</code>
                                        </p>
                                        <p v-if="userDetails.user.referrerId">
                                            <strong>Приглашен:</strong> Да
                                        </p>
                                        <p v-else><strong>Приглашен:</strong> Нет</p>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4" v-if="userDetails.upline.length > 0">
                                <h6>Линия наверх (Upline)</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Уровень</th>
                                                <th>Имя</th>
                                                <th>Email</th>
                                                <th>Реферальный код</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="u in userDetails.upline" :key="u.id">
                                                <td>
                                                    <span class="badge bg-primary">Уровень {{ u.level }}</span>
                                                </td>
                                                <td>{{ u.name }}</td>
                                                <td>{{ u.email }}</td>
                                                <td><code>{{ u.referralCode }}</code></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div v-if="userDetails.directReferrals.length > 0">
                                <h6>
                                    Прямые рефералы ({{ userDetails.directReferralsCount }})
                                </h6>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Имя</th>
                                                <th>Email</th>
                                                <th>Телефон</th>
                                                <th>Реферальный код</th>
                                                <th>Дата регистрации</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="ref in userDetails.directReferrals"
                                                :key="ref.id"
                                            >
                                                <td>{{ ref.name }}</td>
                                                <td>{{ ref.email }}</td>
                                                <td>{{ ref.phone }}</td>
                                                <td><code>{{ ref.referralCode }}</code></td>
                                                <td>
                                                    {{
                                                        (() => {
                                                            if (!ref.created_at) return "-";
                                                            let dateValue = ref.created_at;
                                                            if (typeof dateValue === 'number') {
                                                                if (dateValue < 10000000000) {
                                                                    dateValue = dateValue * 1000;
                                                                }
                                                            } else if (typeof dateValue === 'string') {
                                                                dateValue = parseInt(dateValue);
                                                                if (dateValue < 10000000000) {
                                                                    dateValue = dateValue * 1000;
                                                                }
                                                            }
                                                            try {
                                                                const date = new Date(dateValue);
                                                                if (isNaN(date.getTime())) return "-";
                                                                return date.toLocaleDateString("ru-RU", {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                });
                                                            } catch {
                                                                return "-";
                                                            }
                                                        })()
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-else class="alert alert-info mb-0">
                                У этого пользователя пока нет прямых рефералов
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="showUserDetails = false"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop fade show" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99998; background-color: rgba(0, 0, 0, 0.5);" @click="showUserDetails = false"></div>
            </div>
        </Teleport>
    </AdminLayout>
</template>

<style scoped>
.modal {
    z-index: 99999 !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
}

.modal-dialog {
    z-index: 100000 !important;
    position: relative !important;
}

.modal-backdrop {
    z-index: 99998 !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
}
</style>
