<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import apiService from '@/services/apiService';
import { getImageUrl } from '@/utils/apiConfig';

const errorMessage = ref('');
const showError = ref(false);
const loading = ref(true);

const categories = ref([]);
const products = ref([]);
const selectedCategory = ref(null);
const searchQuery = ref('');

const filteredProducts = computed(() => {
    let result = products.value;

    if (selectedCategory.value) {
        result = result.filter(p => p.categoryId === selectedCategory.value);
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    return result;
});

const discountedProducts = computed(() => {
    return products.value.filter(p => p.discount > 0).slice(0, 3);
});

const loadData = async () => {
    loading.value = true;
    try {
        const [cats, prods] = await Promise.all([
            apiService.getCategories(),
            apiService.getProducts()
        ]);
        categories.value = cats;
        products.value = prods;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    } finally {
        loading.value = false;
        nextTick(() => initSwipers());
    }
};

const selectCategory = (catId) => {
    selectedCategory.value = selectedCategory.value === catId ? null : catId;
};

const initSwipers = () => {
    const Swiper = window.Swiper;
    if (!Swiper) return;

    document.querySelectorAll('.swipernav').forEach((el) => {
        if (el.swiper) {
            el.swiper.destroy(true, true);
        }
        new Swiper(el, {
            slidesPerView: 'auto',
            spaceBetween: 10,
            freeMode: true,
            grabCursor: true,
            touchEventsTarget: 'container',
            simulateTouch: true,
            allowTouchMove: true,
            touchRatio: 1,
            touchStartPreventDefault: false
        });
    });

    document.querySelectorAll('.swipernavpagination').forEach((el) => {
        if (el.swiper) {
            el.swiper.destroy(true, true);
        }
        new Swiper(el, {
            slidesPerView: 'auto',
            spaceBetween: 20,
            freeMode: true,
            grabCursor: true,
            touchEventsTarget: 'container',
            simulateTouch: true,
            allowTouchMove: true,
            touchRatio: 1,
            touchStartPreventDefault: false,
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets'
            }
        });
    });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
};

const getDiscountPrice = (product) => {
    if (!product.discount) return product.price;
    if (product.discountType === "fixed") {
        return Math.max(0, product.price - product.discount);
    }
    return Math.round(product.price * (1 - product.discount / 100));
};

const addToCart = async (product) => {
    showError.value = false;
    errorMessage.value = '';

    try {
        await apiService.addToCart(product.id, 1);
        alert('Товар добавлен в корзину!');
    } catch (error) {
        if (error && error.error) {
            errorMessage.value = error.error;
        } else {
            errorMessage.value = 'Не удалось добавить в корзину. Попробуйте ещё раз.';
        }
        showError.value = true;
    }
};

const getCategoryName = (catId) => {
    const cat = categories.value.find(c => c.id === catId);
    return cat ? cat.name : '';
};

watch(categories, () => {
    nextTick(() => initSwipers());
});

onMounted(() => {
    loadData();
});
</script>

<template>
    <div class="container mt-3" id="main-content">

            <div v-if="showError" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка</strong>
                <br />{{ errorMessage }}
                <button type="button" class="btn-close" @click="showError = false"></button>
            </div>

            <div class="row gx-3 gx-lg-4 align-items-center mb-4 mb-lg-5">
                <div class="col col-sm">
                    <div class="input-group">
                        <input
                            type="search"
                            class="form-control"
                            placeholder="Поиск товаров..."
                            v-model="searchQuery"
                        >
                        <button class="btn btn-link btn-square input-group-text border" type="button">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div class="col-auto">
                    <router-link to="/cart" class="btn btn-theme position-relative">
                        <i class="bi bi-cart"></i>
                    </router-link>
                </div>
            </div>

            <div v-if="discountedProducts.length > 0" class="swiper swipernavpagination mb-3 mb-lg-4">
                <div class="swiper-wrapper">
                    <div
                        v-for="product in discountedProducts"
                        :key="'promo-' + product.id"
                        class="swiper-slide w-auto pb-3 pb-lg-4"
                    >
                        <div class="card adminuiux-card bg-theme-1 overflow-hidden width-280">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <div class="position-relative">
                                            <h3 class="mb-0">
                                                <span v-if="product.discountType === 'fixed'">-₽ {{ formatPrice(product.discount) }}</span>
                                                <span v-else>-{{ product.discount }}%</span>
                                                СКИДКА
                                            </h3>
                                            <p>{{ product.name }}</p>
                                            <span class="badge bg-light text-dark">₽ {{ formatPrice(getDiscountPrice(product)) }}</span>
                                        </div>
                                    </div>
                                    <div class="col-auto position-relative" v-if="product.image">
                                        <figure class="avatar avatar-80 coverimg rounded">
                                            <img :src="getImageUrl(product.image)" class="mw-100" alt="">
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination line bottom-0"></div>
            </div>

            <div v-if="categories.length > 0" class="categories-scroll mb-3 mb-lg-4">
                <button
                    class="btn btn-outline-theme"
                    :class="{ active: !selectedCategory }"
                    @click="selectCategory(null)"
                >
                    Все
                </button>
                <button
                    v-for="cat in categories"
                    :key="cat.id"
                    class="btn btn-outline-theme"
                    :class="{ active: selectedCategory === cat.id }"
                    @click="selectCategory(cat.id)"
                >
                    {{ cat.name }}
                </button>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 text-muted">Загрузка...</p>
            </div>

            <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
                <i class="bi bi-box-seam display-1 text-muted"></i>
                <p class="mt-3 text-muted">
                    {{ searchQuery || selectedCategory ? 'Товары не найдены' : 'Пока нет товаров' }}
                </p>
            </div>

            <div v-else class="row gx-3 gx-lg-4">
                <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="col-6 col-md-4 col-lg-3"
                >
                    <div class="card mb-3 mb-lg-4 style-none product-card">
                        <router-link :to="`/shop/${product.id}`" class="card-body p-1 position-relative d-block text-decoration-none">
                            <div v-if="product.discount" class="position-absolute start-0 top-0 m-2 z-index-1">
                                <div class="badge badge-sm text-bg-theme-1 theme-green">
                                    <span v-if="product.discountType === 'fixed'">-₽ {{ formatPrice(product.discount) }}</span>
                                    <span v-else>-{{ product.discount }}%</span>
                                </div>
                            </div>
                            <figure class="w-100 height-150 rounded coverimg bg-light d-flex align-items-center justify-content-center mb-0">
                                <img
                                    v-if="product.image"
                                    :src="getImageUrl(product.image)"
                                    :alt="product.name"
                                    class="w-100 h-100"
                                    style="object-fit: cover;"
                                >
                                <i v-else class="bi bi-image text-muted display-4"></i>
                            </figure>
                        </router-link>
                        <div class="card-body pt-2">
                            <p class="small text-secondary mb-0 text-truncate">
                                {{ getCategoryName(product.categoryId) || 'Товар' }}
                            </p>
                            <router-link :to="`/shop/${product.id}`" class="mb-1 fw-medium text-truncate d-block text-dark text-decoration-none">
                                {{ product.name }}
                            </router-link>
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <h6 class="mb-0">₽ {{ formatPrice(getDiscountPrice(product)) }}</h6>
                                    <small v-if="product.discount" class="text-muted text-decoration-line-through">
                                        ₽ {{ formatPrice(product.price) }}
                                    </small>
                                </div>
                                <div class="col-auto px-0">
                                    <button
                                        @click="addToCart(product)"
                                        class="btn btn-sm btn-link btn-square text-color-theme"
                                        :disabled="product.stock === 0"
                                    >
                                        <i class="bi bi-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <small v-if="product.stock === 0" class="text-danger">Нет в наличии</small>
                            <small v-else-if="product.stock < 5" class="text-warning">Осталось: {{ product.stock }}</small>
                        </div>
                    </div>
                </div>
            </div>

        </div>
</template>

<style scoped>
.categories-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
}

.categories-scroll::-webkit-scrollbar {
    height: 4px;
}

.categories-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.categories-scroll::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
}

.categories-scroll .btn {
    flex-shrink: 0;
    white-space: nowrap;
}

.product-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
