<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from '@/lib/auth-client';
import apiService from '@/services/apiService';

const router = useRouter();
const session = authClient.useSession();
const loading = ref(true);
const submitting = ref(false);
const cartItems = ref([]);
const error = ref('');
const addresses = ref([]);
const selectedAddressId = ref(null);
const useSavedAddress = ref(false);

const form = ref({
    shippingName: '',
    shippingPhone: '',
    shippingCity: '',
    shippingAddress: '',
    comment: ''
});

const loadCart = async () => {
    loading.value = true;
    try {
        const items = await apiService.getCart();
        cartItems.value = items;
        if (items.length === 0) {
            router.push('/cart');
        }
    } catch (err) {
        console.error('Ошибка загрузки корзины:', err);
    } finally {
        loading.value = false;
    }
};

const loadAddresses = async () => {
    try {
        addresses.value = await apiService.getAddresses();
        const defaultAddress = addresses.value.find(a => a.isDefault === true || a.isDefault === 1);
        if (defaultAddress) {
            selectedAddressId.value = defaultAddress.id;
            useSavedAddress.value = true;
            fillFormFromAddress(defaultAddress);
        } else if (addresses.value.length > 0) {
            selectedAddressId.value = addresses.value[0].id;
        }
    } catch (err) {
        console.error('Ошибка загрузки адресов:', err);
    }
};

const fillFormFromAddress = (address) => {
    if (address) {
        form.value.shippingName = address.name;
        form.value.shippingPhone = address.phone;
        form.value.shippingCity = address.city;
        form.value.shippingAddress = address.address;
    }
};

const onAddressSelect = () => {
    if (selectedAddressId.value) {
        const address = addresses.value.find(a => a.id === selectedAddressId.value);
        if (address) {
            fillFormFromAddress(address);
        }
    }
};

watch(selectedAddressId, () => {
    if (useSavedAddress.value && selectedAddressId.value) {
        onAddressSelect();
    }
});

watch(useSavedAddress, (newVal) => {
    if (newVal && selectedAddressId.value) {
        onAddressSelect();
    } else if (!newVal) {
        loadUserData();
    }
});

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

const total = computed(() => {
    return cartItems.value.reduce((sum, item) => {
        const price = getDiscountPrice(item.product);
        return sum + price * item.quantity;
    }, 0);
});

const itemCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

const isFormValid = computed(() => {
    return form.value.shippingName.trim() &&
           form.value.shippingPhone.trim() &&
           form.value.shippingCity.trim() &&
           form.value.shippingAddress.trim();
});

const submitOrder = async () => {
    if (!isFormValid.value || submitting.value) return;

    error.value = '';
    submitting.value = true;

    try {
        const order = await apiService.createOrder({
            shippingName: form.value.shippingName,
            shippingPhone: form.value.shippingPhone,
            shippingCity: form.value.shippingCity,
            shippingAddress: form.value.shippingAddress,
            comment: form.value.comment
        });

        alert('Заказ успешно оформлен!');
        router.push('/orders');
    } catch (err) {
        error.value = err.error || 'Ошибка при оформлении заказа';
    } finally {
        submitting.value = false;
    }
};

const loadUserData = () => {
    if (session.value?.data?.user) {
        const user = session.value.data.user;
        if (user.name && user.name !== '-') {
            form.value.shippingName = user.name;
        }
        if (user.phone) {
            form.value.shippingPhone = user.phone;
        }
    }
};

watch(() => session.value?.data?.user, () => {
    loadUserData();
}, { immediate: true });

onMounted(async () => {
    await loadCart();
    await loadAddresses();
    if (!useSavedAddress.value || !selectedAddressId.value) {
        loadUserData();
    }
});
</script>

<template>
    <div class="container mt-3" id="main-content">
        <div class="row align-items-center mb-3 mb-lg-4">
            <div class="col">
                <h5 class="mb-0">Оформление заказа</h5>
                <p class="text-secondary small">{{ itemCount }} товаров на сумму ₽ {{ formatPrice(total) }}</p>
            </div>
            <div class="col-auto">
                <router-link to="/cart" class="btn btn-sm btn-outline-theme">
                    <i class="bi bi-arrow-left me-1"></i> Назад
                </router-link>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <template v-else>
            <div v-if="error" class="alert alert-danger mb-3">
                {{ error }}
            </div>

            <div class="row">
                <div class="col-lg-8">
                    <div class="card adminuiux-card mb-3 mb-lg-4">
                        <div class="card-body">
                            <h6 class="mb-3">Данные получателя</h6>
                            
                            <div v-if="addresses.length > 0" class="mb-3">
                                <div class="form-check mb-2">
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        v-model="useSavedAddress"
                                        id="useSavedAddress"
                                    >
                                    <label class="form-check-label" for="useSavedAddress">
                                        Использовать сохранённый адрес
                                    </label>
                                </div>
                                
                                <div v-if="useSavedAddress" class="mb-3">
                                    <select 
                                        class="form-select" 
                                        v-model="selectedAddressId"
                                    >
                                        <option :value="null">Выберите адрес</option>
                                        <option 
                                            v-for="address in addresses" 
                                            :key="address.id" 
                                            :value="address.id"
                                        >
                                            {{ address.name }} - {{ address.city }}, {{ address.address }}{{ (address.isDefault === true || address.isDefault === 1) ? ' (По умолчанию)' : '' }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">ФИО получателя *</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.shippingName"
                                    placeholder="Иванов Иван Иванович"
                                    :disabled="useSavedAddress && selectedAddressId"
                                >
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Телефон *</label>
                                <input 
                                    type="tel" 
                                    class="form-control" 
                                    v-model="form.shippingPhone"
                                    placeholder="+7 (999) 123-45-67"
                                    :disabled="useSavedAddress && selectedAddressId"
                                >
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Город *</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.shippingCity"
                                    placeholder="Москва"
                                    :disabled="useSavedAddress && selectedAddressId"
                                >
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Адрес доставки *</label>
                                <textarea 
                                    class="form-control" 
                                    v-model="form.shippingAddress"
                                    rows="2"
                                    placeholder="ул. Примерная, д. 1, кв. 1"
                                    :disabled="useSavedAddress && selectedAddressId"
                                ></textarea>
                            </div>
                            
                            <div v-if="addresses.length > 0" class="mb-3">
                                <router-link to="/profile-settings" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-gear me-1"></i> Управление адресами
                                </router-link>
                            </div>

                            <div class="mb-0">
                                <label class="form-label">Комментарий к заказу</label>
                                <textarea 
                                    class="form-control" 
                                    v-model="form.comment"
                                    rows="2"
                                    placeholder="Пожелания по доставке..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card adminuiux-card mb-3 mb-lg-4">
                        <div class="card-body">
                            <h6 class="mb-3">Ваш заказ</h6>
                            
                            <div 
                                v-for="item in cartItems" 
                                :key="item.id"
                                class="row gx-2 mb-2 align-items-center"
                            >
                                <div class="col">
                                    <small class="text-truncate d-block">{{ item.product?.name }}</small>
                                </div>
                                <div class="col-auto text-muted">
                                    <small>x{{ item.quantity }}</small>
                                </div>
                                <div class="col-auto">
                                    <small class="fw-medium">₽ {{ formatPrice(getDiscountPrice(item.product) * item.quantity) }}</small>
                                </div>
                            </div>

                            <hr>

                            <div class="row mb-2">
                                <div class="col">Доставка</div>
                                <div class="col-auto text-success">Бесплатно</div>
                            </div>

                            <div class="row mb-3">
                                <div class="col fw-bold">Итого</div>
                                <div class="col-auto fw-bold">₽ {{ formatPrice(total) }}</div>
                            </div>

                            <button 
                                class="btn btn-theme w-100"
                                :disabled="!isFormValid || submitting"
                                @click="submitOrder"
                            >
                                <span v-if="submitting">
                                    <span class="spinner-border spinner-border-sm me-1"></span>
                                    Оформление...
                                </span>
                                <span v-else>
                                    Оформить заказ
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
