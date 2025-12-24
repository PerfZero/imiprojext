<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';

const router = useRouter();
const loading = ref(true);
const cartItems = ref([]);
const couponCode = ref('');
const couponApplied = ref(false);
const couponDiscount = ref(0);
const couponError = ref('');
const appliedCoupon = ref(null);

const loadCart = async () => {
    loading.value = true;
    try {
        const items = await apiService.getCart();
        cartItems.value = items;
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
    } finally {
        loading.value = false;
    }
};

const getDiscountPrice = (product) => {
    if (!product || !product.discount) return product?.price || 0;
    if (product.discountType === "fixed") {
        return Math.max(0, product.price - product.discount);
    }
    return Math.round(product.price * (1 - product.discount / 100));
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};

const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => {
        const price = getDiscountPrice(item.product);
        return sum + price * item.quantity;
    }, 0);
});

const totalDiscount = computed(() => {
    const productDiscount = cartItems.value.reduce((sum, item) => {
        if (!item.product?.discount) return sum;
        const originalPrice = item.product.price;
        const discountedPrice = getDiscountPrice(item.product);
        return sum + (originalPrice - discountedPrice) * item.quantity;
    }, 0);
    return productDiscount + couponDiscount.value;
});

const total = computed(() => {
    return subtotal.value - couponDiscount.value;
});

const itemCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const updateQuantity = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
        await removeItem(item);
        return;
    }

    try {
        await apiService.updateCartItem(item.id, newQuantity);
        item.quantity = newQuantity;
    } catch (error) {
        console.error('Ошибка обновления:', error);
    }
};

const removeItem = async (item) => {
    try {
        await apiService.removeFromCart(item.id);
        cartItems.value = cartItems.value.filter(i => i.id !== item.id);
    } catch (error) {
        console.error('Ошибка удаления:', error);
    }
};

const applyCoupon = async () => {
    if (!couponCode.value.trim()) return;
    
    couponError.value = '';
    couponApplied.value = false;
    couponDiscount.value = 0;
    appliedCoupon.value = null;

    try {
        const result = await apiService.validateCoupon(couponCode.value.trim(), subtotal.value);
        
        if (result.valid) {
            couponApplied.value = true;
            couponDiscount.value = result.discount;
            appliedCoupon.value = result.coupon;
        } else {
            couponError.value = result.error || 'Купон недействителен';
        }
    } catch (error) {
        couponError.value = error.error || 'Ошибка при проверке купона';
    }
};

const removeCoupon = () => {
    couponCode.value = '';
    couponApplied.value = false;
    couponDiscount.value = 0;
    appliedCoupon.value = null;
    couponError.value = '';
};

const checkout = () => {
    if (cartItems.value.length === 0) return;
    router.push('/checkout');
};

onMounted(() => {
    loadCart();
});
</script>

<template>
    <div class="container mt-3" id="main-content">
        <div class="row align-items-center mb-3 mb-lg-4">
            <div class="col col-sm">
                <h5 class="mb-0">Корзина</h5>
                <p class="text-secondary small">{{ itemCount }} товаров</p>
            </div>
            <div class="col-auto">
                <router-link to="/shop" class="btn btn-sm btn-outline-theme">
                    <i class="bi bi-arrow-left me-1"></i> В магазин
                </router-link>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Загрузка...</p>
        </div>

        <div v-else-if="cartItems.length === 0" class="text-center py-5">
            <i class="bi bi-cart-x display-1 text-muted"></i>
            <p class="mt-3 text-muted">Корзина пуста</p>
            <router-link to="/shop" class="btn btn-theme">Перейти в магазин</router-link>
        </div>

        <template v-else>
            <div class="card adminuiux-card mb-3 mb-lg-4">
                <div class="card-body pb-0">
                    <div
                        v-for="item in cartItems"
                        :key="item.id"
                        class="row gx-3 mb-3 mb-lg-4 align-items-center"
                    >
                        <div class="col-auto">
                            <figure
                                class="avatar avatar-60 coverimg rounded bg-light"
                                :style="item.product?.image ? `background-image: url('${item.product.image}')` : ''"
                            >
                                <i v-if="!item.product?.image" class="bi bi-image text-muted"></i>
                            </figure>
                        </div>
                        <div class="col">
                            <p class="mb-1 text-truncate fw-medium">{{ item.product?.name }}</p>
                            <div class="row gx-1 align-items-center">
                                <div class="col-auto">
                                    <button
                                        class="btn btn-sm btn-square btn-link rounded-circle"
                                        @click="updateQuantity(item, -1)"
                                    >-</button>
                                </div>
                                <div class="col-auto">
                                    <input
                                        type="number"
                                        class="form-control form-control-sm text-center px-0"
                                        style="width: 40px;"
                                        :value="item.quantity"
                                        readonly
                                    >
                                </div>
                                <div class="col-auto">
                                    <button
                                        class="btn btn-sm btn-square btn-link rounded-circle"
                                        @click="updateQuantity(item, 1)"
                                    >+</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto text-end">
                            <p class="fw-bold mb-0">₽ {{ formatPrice(getDiscountPrice(item.product) * item.quantity) }}</p>
                            <p class="small text-secondary mb-0">{{ item.quantity }} шт.</p>
                        </div>
                        <div class="col-auto">
                            <button
                                class="btn btn-sm btn-link text-danger"
                                @click="removeItem(item)"
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card adminuiux-card mb-3 mb-lg-4">
                <div class="card-body pb-0">
                    <h6 class="mb-3">Промокод</h6>
                    <div v-if="couponError" class="alert alert-danger alert-sm mb-3">
                        {{ couponError }}
                    </div>
                    <div v-if="couponApplied && appliedCoupon" class="alert alert-success alert-sm mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>
                                <i class="bi bi-check-circle me-1"></i>
                                Купон "{{ appliedCoupon.code }}" применён
                                <span v-if="appliedCoupon.discountType === 'percentage'">
                                    (-{{ appliedCoupon.discount }}%)
                                </span>
                                <span v-else>
                                    (-₽ {{ formatPrice(appliedCoupon.discount) }})
                                </span>
                            </span>
                            <button class="btn btn-sm btn-link text-danger p-0" @click="removeCoupon">
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                    <div class="input-group mb-3 mb-lg-4">
                        <input
                            type="text"
                            class="form-control"
                            v-model="couponCode"
                            placeholder="Введите промокод"
                            :disabled="couponApplied"
                            @keyup.enter="applyCoupon"
                        >
                        <button
                            v-if="!couponApplied"
                            class="btn btn-theme btn-rounded shadow-sm"
                            @click="applyCoupon"
                            :disabled="!couponCode.trim()"
                        >
                            Применить
                        </button>
                        <button
                            v-else
                            class="btn btn-outline-danger btn-rounded"
                            @click="removeCoupon"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>

            <div class="card adminuiux-card mb-3 mb-lg-4">
                <div class="card-body pb-0">
                    <h6 class="mb-3">Итого</h6>
                    <div class="row gx-3 mb-2">
                        <div class="col">Сумма товаров</div>
                        <div class="col-auto">₽ {{ formatPrice(subtotal + totalDiscount - couponDiscount) }}</div>
                    </div>
                    <div v-if="totalDiscount > 0" class="row gx-3 mb-2 text-success">
                        <div class="col">Скидка</div>
                        <div class="col-auto">-₽ {{ formatPrice(totalDiscount) }}</div>
                    </div>
                    <div class="row gx-3 mb-3 mb-lg-4">
                        <div class="col">Доставка</div>
                        <div class="col-auto text-success">БЕСПЛАТНО</div>
                    </div>
                </div>
            </div>

            <div class="text-center mb-3 mb-lg-4">
                <h1 class="text-center mb-4 mb-lg-5">₽ {{ formatPrice(total) }}</h1>
                <button
                    class="btn btn-theme"
                    @click="checkout"
                    :disabled="cartItems.length === 0"
                >
                    Оформить заказ <i class="bi bi-arrow-right"></i>
                </button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar i {
    font-size: 1.5rem;
}
</style>

