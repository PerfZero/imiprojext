<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import apiService from '@/services/apiService';

const loading = ref(true);
const orders = ref([]);
const selectedOrder = ref(null);
const filterStatus = ref('all');

const statuses = [
    { value: 'pending', label: 'Ожидает', class: 'bg-warning' },
    { value: 'processing', label: 'В обработке', class: 'bg-info' },
    { value: 'shipped', label: 'Отправлен', class: 'bg-primary' },
    { value: 'delivered', label: 'Доставлен', class: 'bg-success' },
    { value: 'cancelled', label: 'Отменён', class: 'bg-danger' }
];

const loadOrders = async () => {
    loading.value = true;
    try {
        orders.value = await apiService.getAllOrders();
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
    } finally {
        loading.value = false;
    }
};

const filteredOrders = computed(() => {
    if (filterStatus.value === 'all') return orders.value;
    return orders.value.filter(o => o.status === filterStatus.value);
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusLabel = (status) => {
    const s = statuses.find(st => st.value === status);
    return s ? s.label : status;
};

const getStatusClass = (status) => {
    const s = statuses.find(st => st.value === status);
    return s ? s.class : 'bg-secondary';
};

const updateStatus = async (order, newStatus) => {
    try {
        await apiService.updateOrderStatus(order.id, newStatus);
        order.status = newStatus;
    } catch (error) {
        alert('Ошибка обновления статуса');
    }
};

const openDetails = (order) => {
    selectedOrder.value = order;
};

const closeDetails = () => {
    selectedOrder.value = null;
};

onMounted(() => {
    loadOrders();
});
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Заказы</h4>
        </div>

        <div class="card border-0 shadow-sm mb-3">
            <div class="card-body py-2">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <span class="text-muted small">Фильтр:</span>
                    </div>
                    <div class="col">
                        <div class="btn-group btn-group-sm">
                            <button 
                                class="btn"
                                :class="filterStatus === 'all' ? 'btn-theme' : 'btn-outline-secondary'"
                                @click="filterStatus = 'all'"
                            >Все</button>
                            <button 
                                v-for="s in statuses"
                                :key="s.value"
                                class="btn"
                                :class="filterStatus === s.value ? 'btn-theme' : 'btn-outline-secondary'"
                                @click="filterStatus = s.value"
                            >{{ s.label }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <p class="mt-3 text-muted">Заказов нет</p>
        </div>

        <div v-else class="table-responsive">
            <table class="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Дата</th>
                        <th>Покупатель</th>
                        <th>Товары</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in filteredOrders" :key="order.id">
                        <td><strong>{{ order.id }}</strong></td>
                        <td>
                            <small>{{ formatDate(order.createdAt) }}</small>
                        </td>
                        <td>
                            <div>{{ order.shippingName }}</div>
                            <small class="text-muted">{{ order.user?.email }}</small>
                        </td>
                        <td>
                            <span class="badge bg-secondary">{{ order.items?.length || 0 }} шт.</span>
                        </td>
                        <td>
                            <strong>₽ {{ formatPrice(order.totalAmount) }}</strong>
                        </td>
                        <td>
                            <select 
                                class="form-select form-select-sm"
                                :value="order.status"
                                @change="updateStatus(order, $event.target.value)"
                                style="width: 140px;"
                            >
                                <option 
                                    v-for="s in statuses" 
                                    :key="s.value" 
                                    :value="s.value"
                                >{{ s.label }}</option>
                            </select>
                        </td>
                        <td>
                            <button 
                                class="btn btn-sm btn-link"
                                @click="openDetails(order)"
                            >
                                <i class="bi bi-eye"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="selectedOrder" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Заказ #{{ selectedOrder.id }}</h5>
                        <button type="button" class="btn-close" @click="closeDetails"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <h6>Информация о заказе</h6>
                                <p class="mb-1"><strong>Дата:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
                                <p class="mb-1">
                                    <strong>Статус:</strong> 
                                    <span class="badge" :class="getStatusClass(selectedOrder.status)">
                                        {{ getStatusLabel(selectedOrder.status) }}
                                    </span>
                                </p>
                                <p class="mb-1"><strong>Сумма:</strong> ₽ {{ formatPrice(selectedOrder.totalAmount) }}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Доставка</h6>
                                <p class="mb-1"><strong>Получатель:</strong> {{ selectedOrder.shippingName }}</p>
                                <p class="mb-1"><strong>Телефон:</strong> {{ selectedOrder.shippingPhone }}</p>
                                <p class="mb-1"><strong>Город:</strong> {{ selectedOrder.shippingCity }}</p>
                                <p class="mb-1"><strong>Адрес:</strong> {{ selectedOrder.shippingAddress }}</p>
                                <p v-if="selectedOrder.comment" class="mb-1">
                                    <strong>Комментарий:</strong> {{ selectedOrder.comment }}
                                </p>
                            </div>
                        </div>

                        <h6>Товары</h6>
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Товар</th>
                                    <th class="text-center">Кол-во</th>
                                    <th class="text-end">Цена</th>
                                    <th class="text-end">Сумма</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in selectedOrder.items" :key="item.id">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <figure 
                                                v-if="item.productImage"
                                                class="avatar avatar-40 coverimg rounded me-2 mb-0"
                                                :style="`background-image: url('${item.productImage}')`"
                                            ></figure>
                                            {{ item.productName }}
                                        </div>
                                    </td>
                                    <td class="text-center">{{ item.quantity }}</td>
                                    <td class="text-end">₽ {{ formatPrice(item.price) }}</td>
                                    <td class="text-end">₽ {{ formatPrice(item.price * item.quantity) }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="text-end"><strong>Итого:</strong></td>
                                    <td class="text-end"><strong>₽ {{ formatPrice(selectedOrder.totalAmount) }}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeDetails">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
