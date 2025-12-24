<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/apiService';

const loading = ref(true);
const orders = ref([]);

const loadOrders = async () => {
    loading.value = true;
    try {
        orders.value = await apiService.getOrders();
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
    } finally {
        loading.value = false;
    }
};

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
    const statuses = {
        pending: 'Ожидает',
        processing: 'В обработке',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        cancelled: 'Отменён'
    };
    return statuses[status] || status;
};

const getStatusClass = (status) => {
    const classes = {
        pending: 'bg-warning',
        processing: 'bg-info',
        shipped: 'bg-primary',
        delivered: 'bg-success',
        cancelled: 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
};

onMounted(() => {
    loadOrders();
});
</script>

<template>
    <div class="container mt-3" id="main-content">
        <div class="row align-items-center mb-3 mb-lg-4">
            <div class="col">
                <h5 class="mb-0">Мои заказы</h5>
                <p class="text-secondary small">История ваших покупок</p>
            </div>
            <div class="col-auto">
                <router-link to="/shop" class="btn btn-sm btn-theme">
                    <i class="bi bi-bag me-1"></i> В магазин
                </router-link>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-5">
            <i class="bi bi-box-seam display-1 text-muted"></i>
            <p class="mt-3 text-muted">У вас пока нет заказов</p>
            <router-link to="/shop" class="btn btn-theme">Перейти в магазин</router-link>
        </div>

        <div v-else>
            <div 
                v-for="order in orders" 
                :key="order.id"
                class="card adminuiux-card mb-3"
            >
                <div class="card-body">
                    <div class="row align-items-center mb-3">
                        <div class="col">
                            <h6 class="mb-0">Заказ #{{ order.id }}</h6>
                            <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
                        </div>
                        <div class="col-auto">
                            <span class="badge" :class="getStatusClass(order.status)">
                                {{ getStatusLabel(order.status) }}
                            </span>
                        </div>
                    </div>

                    <div class="row gx-3 mb-3">
                        <div 
                            v-for="item in order.items.slice(0, 3)" 
                            :key="item.id"
                            class="col-auto"
                        >
                            <figure 
                                class="avatar avatar-50 coverimg rounded bg-light mb-0"
                                :style="item.productImage ? `background-image: url('${item.productImage}')` : ''"
                            >
                                <i v-if="!item.productImage" class="bi bi-image text-muted"></i>
                            </figure>
                        </div>
                        <div v-if="order.items.length > 3" class="col-auto align-self-center">
                            <span class="text-muted">+{{ order.items.length - 3 }}</span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <small class="text-muted">
                                {{ order.items.length }} товаров
                            </small>
                        </div>
                        <div class="col-auto">
                            <span class="fw-bold">₽ {{ formatPrice(order.totalAmount) }}</span>
                        </div>
                    </div>

                    <hr class="my-3">

                    <div class="row small text-muted">
                        <div class="col-12 col-md-6 mb-2 mb-md-0">
                            <i class="bi bi-person me-1"></i> {{ order.shippingName }}
                        </div>
                        <div class="col-12 col-md-6">
                            <i class="bi bi-geo-alt me-1"></i> {{ order.shippingCity }}, {{ order.shippingAddress }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
