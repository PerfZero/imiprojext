<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '@/services/apiService';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const loading = ref(true);
const selectedImageIndex = ref(0);
const quantity = ref(1);
const selectedVariant = ref(null);
const errorMessage = ref('');
const showError = ref(false);

const productId = computed(() => Number(route.params.id));

const images = computed(() => {
    if (!product.value) return [];
    if (product.value.images && product.value.images.length > 0) {
        return product.value.images;
    }
    if (product.value.image) {
        return [{ id: 0, url: product.value.image, isMain: true }];
    }
    return [];
});

const currentImage = computed(() => {
    return images.value[selectedImageIndex.value]?.url || null;
});

const discountPrice = computed(() => {
    if (!product.value) return 0;
    const basePrice = selectedVariant.value?.price || product.value.price;
    if (!product.value.discount) return basePrice;
    if (product.value.discountType === "fixed") {
        return Math.max(0, basePrice - product.value.discount);
    }
    return Math.round(basePrice * (1 - product.value.discount / 100));
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};

const loadProduct = async () => {
    loading.value = true;
    try {
        product.value = await apiService.getProduct(productId.value);
    } catch (error) {
        console.error('Ошибка загрузки товара:', error);
        router.push('/shop');
    } finally {
        loading.value = false;
    }
};

const selectImage = (index) => {
    selectedImageIndex.value = index;
};

const selectVariant = (variant) => {
    selectedVariant.value = variant;
    if (variant.image) {
        const imgIndex = images.value.findIndex(img => img.url === variant.image);
        if (imgIndex >= 0) selectedImageIndex.value = imgIndex;
    }
};

const incrementQuantity = () => {
    const maxStock = selectedVariant.value?.stock ?? product.value?.stock ?? 99;
    if (quantity.value < maxStock) {
        quantity.value++;
    }
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const buy = async () => {
    showError.value = false;
    errorMessage.value = '';

    try {
        const price = discountPrice.value * quantity.value;
        const name = selectedVariant.value
            ? `${product.value.name} (${selectedVariant.value.attributes?.map(a => a.value).join(', ') || selectedVariant.value.sku})`
            : product.value.name;

        await apiService.walletPurchase({
            currency: product.value.currency || 'RUB',
            amount: price,
            description: `${name} x${quantity.value}`
        });
        alert('Покупка успешна!');
    } catch (error) {
        if (error && error.error) {
            errorMessage.value = error.error;
        } else {
            errorMessage.value = 'Не удалось выполнить покупку. Попробуйте ещё раз.';
        }
        showError.value = true;
    }
};

const goBack = () => {
    router.push('/shop');
};

onMounted(() => {
    loadProduct();
});
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <div v-if="loading" class="container mt-5 text-center">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Загрузка...</p>
        </div>

        <template v-else-if="product">
            <div class="container-fluid py-3">
                <div class="row gx-3 align-items-center page-title">
                    <div class="col-auto">
                        <button class="btn btn-link btn-square" @click="goBack">
                            <i class="bi bi-arrow-left"></i>
                        </button>
                    </div>
                    <div class="col col-sm">
                        <h5 class="mb-0">{{ product.name }}</h5>
                        <p class="text-secondary small mb-0" v-if="product.categoryName">{{ product.categoryName }}</p>
                    </div>
                    <div class="col-auto position-relative">
                        <button class="btn btn-theme btn-square text-color-theme" @click="buy">
                            <i class="bi bi-bag-plus"></i>
                        </button>
                    </div>
                </div>
                <nav aria-label="breadcrumb" class="breadcrumb-theme mt-3 rounded d-none d-lg-block">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item bi"><router-link to="/dashboard"><i class="bi bi-house-door me-2"></i>Главная</router-link></li>
                        <li class="breadcrumb-item bi"><router-link to="/shop">Магазин</router-link></li>
                        <li class="breadcrumb-item active bi" aria-current="page">{{ product.name }}</li>
                    </ol>
                </nav>
            </div>

            <div class="container mt-3" id="main-content">
                <div v-if="showError" class="alert alert-danger alert-dismissible fade show mb-4">
                    <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка</strong>
                    <br />{{ errorMessage }}
                    <button type="button" class="btn-close" @click="showError = false"></button>
                </div>

                <div class="row gx-3 gx-lg-4">
                    <div class="col-12 col-lg-12 col-xl-5">
                        <div class="mb-3">
                            <figure
                                class="height-300 w-100 rounded bg-light d-flex align-items-center justify-content-center overflow-hidden"
                                style="background-size: cover; background-position: center;"
                                :style="currentImage ? { backgroundImage: `url(${currentImage})` } : {}"
                            >
                                <i v-if="!currentImage" class="bi bi-image text-muted display-1"></i>
                            </figure>
                        </div>

                        <div v-if="images.length > 1" class="card adminuiux-card mb-3 mb-lg-4">
                            <div class="card-body pb-2">
                                <div class="thumbnails-scroll">
                                    <figure
                                        v-for="(img, index) in images"
                                        :key="img.id"
                                        class="avatar avatar-80 coverimg rounded-2 cursor-pointer"
                                        :class="{ 'border border-primary border-2': index === selectedImageIndex }"
                                        :style="{ backgroundImage: `url(${img.url})` }"
                                        @click="selectImage(index)"
                                    ></figure>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-12 col-xl-7">
                        <div class="row gx-3 gx-lg-4 small mb-3 mb-lg-4">
                            <div class="col-auto mb-3" v-if="product.stock > 0">
                                <p class="text-success mb-0">
                                    <i class="bi bi-check-circle me-1"></i>
                                    В наличии: {{ product.stock }} шт.
                                </p>
                            </div>
                            <div class="col-auto mb-3" v-else>
                                <p class="text-danger mb-0">
                                    <i class="bi bi-x-circle me-1"></i>
                                    Нет в наличии
                                </p>
                            </div>
                        </div>

                        <div class="mb-3 mb-lg-4">
                            <h6 v-if="product.discount" class="text-success">Специальная цена</h6>
                            <h4 class="mb-2">
                                ₽ {{ formatPrice(discountPrice) }}
                                <s v-if="product.discount" class="small fw-medium text-secondary">
                                    ₽ {{ formatPrice(selectedVariant?.price || product.price) }}
                                </s>
                            </h4>
                            <span v-if="product.discount" class="badge bg-success">
                                <span v-if="product.discountType === 'fixed'">-₽ {{ formatPrice(product.discount) }}</span>
                                <span v-else>-{{ product.discount }}%</span>
                            </span>
                        </div>

                        <div v-if="product.variants && product.variants.length > 0" class="card adminuiux-card mb-3 mb-lg-4">
                            <div class="card-body pb-0">
                                <h6 class="mb-3">Варианты</h6>
                                <div
                                    v-for="variant in product.variants"
                                    :key="variant.id"
                                    class="row gx-3 gx-lg-4 align-items-center mb-3 mb-lg-4"
                                >
                                    <div class="col">
                                        <h6 class="mb-0">
                                            <span v-if="variant.attributes && variant.attributes.length">
                                                {{ variant.attributes.map(a => a.value).join(' / ') }}
                                            </span>
                                            <span v-else>{{ variant.sku || `Вариант ${variant.id}` }}</span>
                                            <span v-if="variant.price" class="small fw-medium text-secondary ms-2">
                                                ₽ {{ formatPrice(variant.price) }}
                                            </span>
                                        </h6>
                                        <small class="text-muted">В наличии: {{ variant.stock }} шт.</small>
                                    </div>
                                    <div class="col-auto">
                                        <button
                                            class="btn btn-sm btn-square rounded-circle"
                                            :class="selectedVariant?.id === variant.id ? 'btn-theme' : 'btn-outline-theme'"
                                            @click="selectVariant(variant)"
                                            :disabled="variant.stock === 0"
                                        >
                                            <i class="bi bi-check-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card adminuiux-card mb-3 mb-lg-4">
                            <div class="card-body">
                                <h6 class="mb-3">Количество</h6>
                                <div class="row gx-3 align-items-center">
                                    <div class="col-auto">
                                        <div class="row gx-2">
                                            <div class="col-auto">
                                                <button
                                                    class="btn btn-sm btn-square btn-outline-secondary rounded-circle"
                                                    @click="decrementQuantity"
                                                    :disabled="quantity <= 1"
                                                >-</button>
                                            </div>
                                            <div class="col-auto">
                                                <input
                                                    type="number"
                                                    class="form-control form-control-sm text-center"
                                                    style="width: 60px;"
                                                    v-model.number="quantity"
                                                    min="1"
                                                >
                                            </div>
                                            <div class="col-auto">
                                                <button
                                                    class="btn btn-sm btn-square btn-outline-secondary rounded-circle"
                                                    @click="incrementQuantity"
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <h5 class="mb-0 text-end">Итого: ₽ {{ formatPrice(discountPrice * quantity) }}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card adminuiux-card mb-3 mb-lg-4" v-if="product.attributes && product.attributes.length > 0">
                            <div class="card-body">
                                <h6 class="mb-3">Характеристики</h6>
                                <dl class="row mb-0">
                                    <template v-for="attr in product.attributes" :key="attr.id">
                                        <dt class="col-5">{{ attr.attributeName }}:</dt>
                                        <dd class="col-7">{{ attr.value }}</dd>
                                    </template>
                                </dl>
                            </div>
                        </div>

                        <div class="card adminuiux-card mb-3 mb-lg-4" v-if="product.description">
                            <div class="card-body">
                                <h6 class="mb-3">Описание</h6>
                                <p class="mb-0">{{ product.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer class="adminuiux-mobile-footer d-lg-none">
                <ul class="nav nav-pills justify-content-center">
                    <li class="nav-item flex-grow-1">
                        <button
                            class="btn btn-theme w-100"
                            @click="buy"
                            :disabled="product.stock === 0"
                        >
                            <i class="bi bi-bag-plus me-2"></i>
                            Купить за ₽ {{ formatPrice(discountPrice * quantity) }}
                        </button>
                    </li>
                </ul>
            </footer>
        </template>

        <div v-else class="container mt-5 text-center">
            <i class="bi bi-exclamation-triangle display-1 text-muted"></i>
            <p class="mt-3">Товар не найден</p>
            <router-link to="/shop" class="btn btn-primary">Вернуться в магазин</router-link>
        </div>
    </main>
</template>

<style scoped>
.thumbnails-scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 8px;
}

.thumbnails-scroll::-webkit-scrollbar {
    height: 4px;
}

.thumbnails-scroll::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
}

.cursor-pointer {
    cursor: pointer;
}

.adminuiux-mobile-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--adminuiux-bg, #fff);
    padding: 12px 16px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 100;
}
</style>
