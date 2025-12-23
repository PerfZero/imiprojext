<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useToast } from '@/composables/useToast';
import apiService from '@/services/apiService';
import { authClient } from '@/lib/auth-client';
import { formatTimestamp } from '@/utils/formatDateTime';
import { useNotifications } from '@/composables/useNotifications';

const { showToast } = useToast();
const route = useRoute();
const session = authClient.useSession();
const { onNotify } = useNotifications();

const currency = computed(() => String(route.params.currency || 'RUB'));
const balance = ref(null);
const balances = ref([]);
const transactions = ref([]);
const loading = ref(true);

watch(() => route.params.currency, () => {
    loadData();
}, { immediate: false });

const generateCardNumber = (userId, currency, index) => {
    const seed = `${userId}-${currency}-${index}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const absHash = Math.abs(hash);
    const cardDigits = String(absHash).padStart(12, '0').slice(-12);
    const cardNumber = `0000 ${cardDigits.slice(0, 4)} ${cardDigits.slice(4, 8)} ${cardDigits.slice(8, 12)}`;
    return cardNumber;
};

const generateExpiryDate = (userId, currency, index) => {
    const seed = `${userId}-${currency}-${index}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const absHash = Math.abs(hash);
    const month = (absHash % 12) + 1;
    const year = new Date().getFullYear() + 3 + (absHash % 2);
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
};

const cardIndex = computed(() => {
    return balances.value.findIndex(b => b.currency === currency.value);
});

const cardNumber = computed(() => {
    const index = cardIndex.value >= 0 ? cardIndex.value : 0;
    return generateCardNumber(session.data?.user?.id || '', currency.value, index);
});

const expiryDate = computed(() => {
    const index = cardIndex.value >= 0 ? cardIndex.value : 0;
    return generateExpiryDate(session.data?.user?.id || '', currency.value, index);
});

const sentMoney = computed(() => {
    return transactions.value
        .filter(t => (t.type === 'withdraw' || t.type === 'purchase' || t.type === 'convert_out' || t.type === 'transfer_out') && t.currency === currency.value)
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);
});

const receivedMoney = computed(() => {
    return transactions.value
        .filter(t => (t.type === 'deposit' || t.type === 'mlm_reward' || t.type === 'convert_in' || t.type === 'transfer_in') && t.currency === currency.value)
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
});

const loadData = async () => {
    try {
        loading.value = true;
        balances.value = await apiService.getUserBalances();
        balance.value = balances.value.find(b => b.currency === currency.value);
        
        const allTransactions = await apiService.getTransactions();
        transactions.value = allTransactions
            .filter(t => t.currency === currency.value)
            .slice(0, 5);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    } finally {
        loading.value = false;
    }
};

const typeToName = (type) => {
    const names = {
        'mlm_reward': 'Награда MLM',
        'deposit': 'Пополнение',
        'purchase': 'Покупка',
        'withdraw': 'Вывод',
        'convert_in': 'Конвертация (входящая)',
        'convert_out': 'Конвертация (исходящая)',
        'transfer_in': 'Получен перевод',
        'transfer_out': 'Отправлен перевод'
    };
    return names[type] || type;
};

const typeToIcon = (type) => {
    const icons = {
        'mlm_reward': 'bi-currency-dollar',
        'deposit': 'bi-arrow-down-left',
        'purchase': 'bi-bag',
        'withdraw': 'bi-arrow-up-right',
        'convert_in': 'bi-arrow-down-left',
        'convert_out': 'bi-arrow-up-right',
        'transfer_in': 'bi-arrow-down-left',
        'transfer_out': 'bi-arrow-up-right'
    };
    return icons[type] || 'bi-currency-dollar';
};

const isPositive = (type) => {
    return type === 'deposit' || type === 'mlm_reward' || type === 'convert_in' || type === 'transfer_in';
};

onMounted(() => {
    loadData();
});

onNotify((data) => {
    if (data.notification?.category === 'wallet' || data.notification?.category === 'mlm') {
        loadData();
    }
});
</script>

<template>
    <div class="container mt-3" id="main-content">
        <div class="row gx-3 gx-lg-4">
            <div class="col-12 col-md-6 col-xl-4">
                <div class="card adminuiux-card overflow-hidden w-100 bg-theme-1-subtle mb-3 mb-lg-4">
                    <div class="card adminuiux-card bg-theme-1 overflow-hidden w-100">
                        <div class="coverimg h-100 w-100 position-absolute top-0 start-0 z-index-0 opacity-25" style="background-image: url('/assets/img/template/splash01.svg');">
                            <img src="/assets/img/template/splash01.svg" alt="" style="display: none;">
                        </div>
                        <div class="card-body z-index-1">
                            <div class="row gx-3 align-items-center mb-2">
                                <div class="col-auto align-self-center">
                                    <i class="bi bi-credit-card fs-4"></i>
                                </div>
                                <div class="col text-end">
                                    <p><span class="small opacity-50">IMI CLUB</span><br><span class="">Кредитная карта</span></p>
                                </div>
                            </div>
                            <h4 class="fw-normal my-4 my-md-5">{{ cardNumber }}</h4>
                            <div class="row gx-3">
                                <div class="col-auto">
                                    <p class="mb-0 small opacity-50">Срок действия</p>
                                    <p>{{ expiryDate }}</p>
                                </div>
                                <div class="col text-end">
                                    <p class="mb-0 small opacity-50">Держатель карты</p>
                                    <p>{{ session.data?.user?.name || 'Пользователь' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body z-index-1">
                        <div class="row gx-3 align-items-center">
                            <div class="col">
                                <h5 v-if="balance">{{ parseFloat(balance.balance).toFixed(2) }}</h5>
                                <h5 v-else>0.00</h5>
                            </div>
                            <div class="col-auto">
                                <p class="text-secondary small">{{ currency }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-12 col-md-6 col-xl-4">
                <div class="row gx-3 gx-lg-4">
                    <div class="col-6 col-md-12 mb-3 mb-lg-4">
                        <div class="card adminuiux-card bg-theme-1-subtle theme-red">
                            <div class="card-body">
                                <p class="text-secondary small mb-2">Отправлено денег</p>
                                <h2 class="mb-3">{{ (sentMoney / 1000).toFixed(2) }}k</h2>
                                <span class="badge badge-light text-bg-danger">
                                    <i class="me-1 bi bi-arrow-down-short"></i>18.25%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-12 mb-3 mb-lg-4">
                        <div class="card adminuiux-card bg-theme-1-subtle theme-green">
                            <div class="card-body">
                                <p class="text-secondary small mb-2">Получено денег</p>
                                <h2 class="mb-3">{{ (receivedMoney / 1000).toFixed(2) }}k</h2>
                                <span class="badge badge-light text-bg-success">
                                    <i class="me-1 bi bi-arrow-up-short"></i>54.35%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row gx-3 align-items-center mb-3">
            <div class="col">
                <h6>Отправить деньги</h6>
            </div>
            <div class="col-auto">
            </div>
        </div>
        
        <div class="swiper swipernav mb-3 mb-lg-4 swiper-initialized swiper-horizontal swiper-backface-hidden">
            <div class="swiper-wrapper">
                <div class="swiper-slide w-auto swiper-slide-active" role="group" style="margin-right: 20px;">
                    <RouterLink to="/pay" class="avatar avatar-40 rounded-circle border border-dotted border-theme style-none">
                        <span class="h4">+</span>
                    </RouterLink>
                </div>
                <div v-for="(transaction, index) in transactions.slice(0, 8)" :key="index" class="swiper-slide w-auto" role="group" style="margin-right: 20px;">
                    <div class="avatar avatar-40 rounded-circle coverimg" style="background-image: url('/assets/img/template/user-1.jpg');">
                        <img src="/assets/img/template/user-1.jpg" alt="" style="display: none;">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row gx-3 align-items-center mb-3">
            <div class="col">
                <h6>Недавние транзакции</h6>
            </div>
            <div class="col-auto">
                <RouterLink to="/pays" class="btn btn-sm btn-link text-center">
                    Показать все <i class="bi bi-chevron-right"></i>
                </RouterLink>
            </div>
        </div>

        <div class="row">
            <div class="col-12 px-0">
                <ul class="list-group list-group-flush border-top border-bottom bg-none mb-3 mb-lg-4">
                    <li v-for="transaction in transactions" :key="transaction.id" class="list-group-item" :class="{ 'theme-green': isPositive(transaction.type) }">
                        <div class="row gx-3 align-items-center">
                            <div class="col-auto">
                                <div v-if="transaction.metadata && JSON.parse(transaction.metadata || '{}').image" class="avatar avatar-40 rounded-circle border coverimg" :style="{ backgroundImage: `url(${JSON.parse(transaction.metadata).image})` }">
                                    <img :src="JSON.parse(transaction.metadata).image" alt="" style="display: none;">
                                </div>
                                <div v-else class="avatar avatar-40 rounded-circle border" :class="isPositive(transaction.type) ? 'border-theme-1 bg-theme-1-subtle text-theme-1' : 'border-theme-1 bg-theme-1'">
                                    <i :class="`bi ${typeToIcon(transaction.type)} h5`"></i>
                                </div>
                            </div>
                            <div class="col">
                                <p class="mb-1 fw-medium">{{ typeToName(transaction.type) }}</p>
                                <p class="text-secondary small">{{ formatTimestamp(transaction.createdAt) }}</p>
                            </div>
                            <div class="col-auto">
                                <h6 :class="isPositive(transaction.type) ? 'text-theme-1' : ''">
                                    {{ isPositive(transaction.type) ? '+' : '-' }} {{ parseFloat(transaction.amount).toFixed(2) }} {{ transaction.currency }}
                                </h6>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

