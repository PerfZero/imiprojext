<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import apiService from '@/services/apiService';

const loading = ref(true);
const coupons = ref([]);
const showModal = ref(false);
const editingCoupon = ref(null);
const form = ref({
    code: '',
    discount: 0,
    discountType: 'percentage',
    minAmount: 0,
    maxDiscount: null,
    usageLimit: null,
    validFrom: null,
    validUntil: null,
    isActive: true,
});

const loadCoupons = async () => {
    loading.value = true;
    try {
        coupons.value = await apiService.getCoupons();
    } catch (error) {
        console.error('Ошибка загрузки купонов:', error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};

const openModal = (coupon = null) => {
    editingCoupon.value = coupon;
    if (coupon) {
        form.value = {
            code: coupon.code,
            discount: coupon.discount,
            discountType: coupon.discountType,
            minAmount: coupon.minAmount || 0,
            maxDiscount: coupon.maxDiscount || null,
            usageLimit: coupon.usageLimit || null,
            validFrom: coupon.validFrom || null,
            validUntil: coupon.validUntil || null,
            isActive: coupon.isActive,
        };
    } else {
        form.value = {
            code: '',
            discount: 0,
            discountType: 'percentage',
            minAmount: 0,
            maxDiscount: null,
            usageLimit: null,
            validFrom: null,
            validUntil: null,
            isActive: true,
        };
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    editingCoupon.value = null;
};

const saveCoupon = async () => {
    try {
        const data = {
            code: form.value.code,
            discount: parseFloat(form.value.discount),
            discountType: form.value.discountType,
            minAmount: form.value.minAmount && form.value.minAmount > 0 ? parseFloat(form.value.minAmount) : null,
            maxDiscount: form.value.maxDiscount && form.value.maxDiscount > 0 ? parseFloat(form.value.maxDiscount) : null,
            usageLimit: form.value.usageLimit && form.value.usageLimit > 0 ? parseInt(form.value.usageLimit) : null,
            validFrom: form.value.validFrom ? Math.floor(new Date(form.value.validFrom).getTime() / 1000) : null,
            validUntil: form.value.validUntil ? Math.floor(new Date(form.value.validUntil).getTime() / 1000) : null,
            isActive: form.value.isActive,
        };

        if (editingCoupon.value) {
            await apiService.updateCoupon(editingCoupon.value.id, data);
        } else {
            await apiService.createCoupon(data);
        }
        
        await loadCoupons();
        closeModal();
    } catch (error) {
        alert(error.error || 'Ошибка при сохранении купона');
    }
};

const deleteCoupon = async (id) => {
    if (!confirm('Удалить купон?')) return;
    
    try {
        await apiService.deleteCoupon(id);
        await loadCoupons();
    } catch (error) {
        alert('Ошибка при удалении купона');
    }
};

onMounted(() => {
    loadCoupons();
});
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Купоны</h4>
            <button class="btn btn-primary" @click="openModal()">
                <i class="bi bi-plus-lg me-1"></i> Создать купон
            </button>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="coupons.length === 0" class="text-center py-5">
            <i class="bi bi-ticket-perforated display-1 text-muted"></i>
            <p class="mt-3 text-muted">Купонов нет</p>
        </div>

        <div v-else class="table-responsive">
            <table class="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Код</th>
                        <th>Скидка</th>
                        <th>Мин. сумма</th>
                        <th>Использовано</th>
                        <th>Действителен до</th>
                        <th>Статус</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="coupon in coupons" :key="coupon.id">
                        <td><strong>{{ coupon.code }}</strong></td>
                        <td>
                            <span v-if="coupon.discountType === 'percentage'">
                                {{ coupon.discount }}%
                            </span>
                            <span v-else>
                                ₽ {{ formatPrice(coupon.discount) }}
                            </span>
                            <span v-if="coupon.maxDiscount" class="text-muted small d-block">
                                макс. ₽ {{ formatPrice(coupon.maxDiscount) }}
                            </span>
                        </td>
                        <td>
                            <span v-if="coupon.minAmount > 0">
                                ₽ {{ formatPrice(coupon.minAmount) }}
                            </span>
                            <span v-else class="text-muted">-</span>
                        </td>
                        <td>
                            {{ coupon.usedCount || 0 }}
                            <span v-if="coupon.usageLimit" class="text-muted">
                                / {{ coupon.usageLimit }}
                            </span>
                        </td>
                        <td>
                            <small>{{ formatDate(coupon.validUntil) }}</small>
                        </td>
                        <td>
                            <span class="badge" :class="coupon.isActive ? 'bg-success' : 'bg-secondary'">
                                {{ coupon.isActive ? 'Активен' : 'Неактивен' }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-link" @click="openModal(coupon)">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-link text-danger" @click="deleteCoupon(coupon.id)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ editingCoupon ? 'Редактировать купон' : 'Создать купон' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Код купона *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="form.code"
                                placeholder="PROMO2024"
                                :disabled="!!editingCoupon"
                            >
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Тип скидки *</label>
                            <select class="form-select" v-model="form.discountType">
                                <option value="percentage">Процент (%)</option>
                                <option value="fixed">Фиксированная сумма (₽)</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Размер скидки *</label>
                            <input 
                                type="number" 
                                class="form-control" 
                                v-model.number="form.discount"
                                :placeholder="form.discountType === 'percentage' ? '10' : '1000'"
                                min="0"
                                step="0.01"
                            >
                        </div>

                        <div class="mb-3" v-if="form.discountType === 'percentage'">
                            <label class="form-label">Максимальная скидка (₽)</label>
                            <input 
                                type="number" 
                                class="form-control" 
                                v-model.number="form.maxDiscount"
                                placeholder="Не ограничено"
                                min="0"
                                step="0.01"
                            >
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Минимальная сумма заказа (₽)</label>
                            <input 
                                type="number" 
                                class="form-control" 
                                v-model.number="form.minAmount"
                                placeholder="0"
                                min="0"
                                step="0.01"
                            >
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Лимит использований</label>
                            <input 
                                type="number" 
                                class="form-control" 
                                v-model.number="form.usageLimit"
                                placeholder="Не ограничено"
                                min="1"
                            >
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Действителен с</label>
                            <input 
                                type="datetime-local" 
                                class="form-control" 
                                v-model="form.validFrom"
                            >
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Действителен до</label>
                            <input 
                                type="datetime-local" 
                                class="form-control" 
                                v-model="form.validUntil"
                            >
                        </div>

                        <div class="mb-0">
                            <div class="form-check">
                                <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    v-model="form.isActive"
                                    id="couponActive"
                                >
                                <label class="form-check-label" for="couponActive">
                                    Активен
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Отмена</button>
                        <button type="button" class="btn btn-primary" @click="saveCoupon">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

