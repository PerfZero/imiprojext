<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import apiService from '@/services/apiService';
import { formatTimestamp } from '@/utils/formatDateTime';
import { useNotifications } from '@/composables/useNotifications';
import { useUser } from '@/composables/useUser';

const { onNotify } = useNotifications();
const { user } = useUser();

const balances = ref([]);
const transactions = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const updateBalances = async () => {
    try {
        balances.value = await apiService.getUserBalances();
    } catch (error) {
        console.error('Ошибка загрузки балансов:', error);
    }
};

const updateTransactions = async () => {
    try {
        const data = await apiService.getTransactions();
        transactions.value = data.slice(0, 5);
    } catch (error) {
        console.error('Ошибка загрузки транзакций:', error);
    } finally {
        loading.value = false;
    }
};

const totalBalance = ref(0);
const totalReceived = ref(0);
const totalSent = ref(0);

const calculateStats = () => {
    totalBalance.value = balances.value.reduce((sum, b) => sum + (parseFloat(b.balance) || 0), 0);
    
    const received = transactions.value
        .filter(t => t.type === 'deposit' || t.type === 'mlm_reward' || t.type === 'convert_in')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    totalReceived.value = received;
    
    const sent = transactions.value
        .filter(t => t.type === 'withdraw' || t.type === 'purchase' || t.type === 'convert_out')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    totalSent.value = sent;
};

const typeToName = (type) => {
    const names = {
        'mlm_reward': 'Награда MLM',
        'deposit': 'Пополнение',
        'purchase': 'Покупка',
        'withdraw': 'Вывод',
        'convert_in': 'Конвертация (входящая)',
        'convert_out': 'Конвертация (исходящая)'
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
        'convert_out': 'bi-arrow-up-right'
    };
    return icons[type] || 'bi-currency-dollar';
};

const isPositive = (type) => {
    return type === 'deposit' || type === 'mlm_reward' || type === 'convert_in';
};

import { generateCardNumber, generateExpiryDate } from '@/utils/cardUtils';

onMounted(async () => {
    await updateBalances();
    await updateTransactions();
    calculateStats();
});

onNotify((data) => {
    if (data.notification?.category === 'wallet' || data.notification?.category === 'mlm') {
        updateBalances();
        updateTransactions().then(() => calculateStats());
    }
});
</script>

<template>
    <div class="container mt-3" id="main-content">
            <div class="row gx-3 gx-lg-4 align-items-center page-title mb-4 mb-lg-5">
                <div class="col col-sm">
                    <div class="input-group">
                        <input v-model="searchQuery" type="search" class="form-control" placeholder="Поиск...">
                        <button class="btn btn-link btn-square input-group-text border" type="button">
                            <i class="bi bi-search"></i>
                        </button>
                </div>
                </div>
                <div class="col-auto">
                    <button class="btn btn-link btn-square" data-bs-toggle="offcanvas" data-bs-target="#filter" data-bs-placement="end">
                        <i class="bi bi-filter"></i>
                    </button>
                </div>
            </div>
            
            <div class="row gx-3 gx-lg-4 align-items-center">
                <div class="col-12">
                    <div class="swiper swipernav swiper-initialized swiper-horizontal swiper-backface-hidden">
                        <div class="swiper-wrapper">
                            <div v-for="(balance, index) in balances" :key="balance.currency" class="swiper-slide w-auto pb-3 pb-lg-4" :class="{ 'swiper-slide-active': index === 0 }" style="margin-right: 20px;">
                                <RouterLink :to="`/wallet/${balance.currency}`" class="card adminuiux-card overflow-hidden width-300 style-none">
                                    <div class="card adminuiux-card w-100" :class="{
                                        'bg-theme-1': index === 0,
                                        'bg-theme-accent-1': index === 1,
                                        'bg-r-gradient border-0 rounded-4': index === 2,
                                        'overflow-hidden': index !== 2
                                    }">
                                        <div v-if="index !== 2" class="coverimg h-100 w-100 position-absolute top-0 start-0 z-index-0 opacity-25" style="background-image: url('/assets/img/template/splash01.svg');">
                                        </div>
                                        <div class="card-body z-index-1" :class="{ 'rounded': index === 2 }">
                                            <div class="row gx-3 align-items-center mb-2">
                                                <div class="col-auto align-self-center">
                                                    <i class="bi bi-credit-card fs-4"></i>
                                                </div>
                                                <div class="col text-end">
                                                    <p><span class="small opacity-50">IMI CLUB</span><br><span class="">Кредитная карта</span></p>
                                                </div>
                                            </div>
                                            <h4 class="fw-normal my-4 my-lg-5">{{ generateCardNumber(user?.id || '', balance.currency, index) }}</h4>
                                            <div class="row gx-3">
                                                <div class="col-auto">
                                                    <p class="mb-0 small opacity-50">Срок действия</p>
                                                    <p>{{ generateExpiryDate(user?.id || '', balance.currency, index) }}</p>
                                                </div>
                                                <div class="col text-end">
                                                    <p class="mb-0 small opacity-50">Держатель карты</p>
                                                    <p>{{ user?.name || 'Пользователь' }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body z-index-1">
                                        <div class="row gx-3 align-items-center">
                                            <div class="col">
                                                <h5>{{ parseFloat(balance.balance).toFixed(2) }}</h5>
                                            </div>
                                            <div class="col-auto">
                                                <p class="text-secondary small">{{ balance.currency }}</p>
                                            </div>
                                            <div class="col-auto">
                                                <span class="btn btn-square btn-sm btn-link"><i class="bi bi-chevron-right"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row gx-2 align-items-center justify-content-center mb-3 mb-lg-4">
                        <div class="col-auto py-2">
                            <RouterLink to="/pay" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Перевод" data-bs-original-title="Перевод">
                                <i class="bi bi-send"></i>
                            </RouterLink>
                        </div>
                        <div class="col-auto py-2">
                            <RouterLink to="/pays" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Сканировать для оплаты" data-bs-original-title="Сканировать для оплаты">
                                <i class="bi bi-qr-code"></i>
                            </RouterLink>
                </div>
                        <div class="col-auto py-2">
                            <RouterLink to="/withdraw" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Отправить деньги" data-bs-original-title="Отправить деньги">
                                <i class="bi bi-arrow-up-right"></i>
                            </RouterLink>
                        </div>
                        <div class="col-auto py-2">
                            <RouterLink to="/topup" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Получить деньги" data-bs-original-title="Получить деньги">
                                <i class="bi bi-arrow-down-left"></i>
                            </RouterLink>
                        </div>
                        <div class="col-auto py-2">
                            <RouterLink to="/topup" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Добавить деньги" data-bs-original-title="Добавить деньги">
                                <i class="bi bi-plus-lg"></i>
                            </RouterLink>
                        </div>
                        <div class="col-auto py-2">
                            <RouterLink to="/convert" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Конвертировать" data-bs-original-title="Конвертировать">
                                <i class="bi bi-arrow-left-right"></i>
                            </RouterLink>
                        </div>
                        <div class="col-auto py-2">
                            <button class="btn btn-lg btn-square btn-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" title="Больше">
                                <i class="bi bi-grid"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-6 col-sm-6 col-md-4 col-xl-4 mb-3 mb-lg-4">
                    <div class="card adminuiux-card">
                        <div class="card-body">
                            <p class="text-secondary small mb-2">Общая прибыль</p>
                            <h2 class="mb-3">${{ totalReceived.toFixed(2) }}</h2>
                            <span class="badge badge-light text-bg-success">
                                <i class="me-1 bi bi-arrow-up-short"></i>28.50%
                            </span>
                        </div>
                    </div>
                        </div>
                
                <div class="col-6 col-sm-6 col-md-4 col-xl-4 mb-3 mb-lg-4">
                    <div class="card adminuiux-card">
                        <div class="card-body">
                            <p class="text-secondary small mb-2">Лучшая прибыль</p>
                            <h2 class="mb-3">${{ totalReceived.toFixed(2) }}</h2>
                            <span class="badge badge-light text-bg-success">
                                <i class="me-1 bi bi-arrow-up-short"></i>54.35%
                            </span>
                        </div>
                    </div>
                        </div>
                
                <div class="col-12 col-md-4 col-lg-4 col-xl-4 mb-3 mb-lg-4">
                    <div class="card adminuiux-card">
                        <div class="card-body">
                            <p class="text-secondary small mb-2">Ваш портфель</p>
                            <h2 class="mb-3">${{ totalBalance.toFixed(2) }} <i class="fs-5 bi bi-arrow-up"></i></h2>
                            <span class="badge badge-light text-bg-success">
                                <i class="me-1 bi bi-arrow-up-short"></i>За последние 7 дней
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row gx-3 gx-lg-4">
                <div class="col-12 mb-3 mb-lg-4">
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
                    
                    <div class="swiper swipernav mb-3 mb-lg-4 swiper-initialized swiper-horizontal swiper-backface-hidden">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide w-auto swiper-slide-active" role="group" style="margin-right: 20px;">
                                <div class="avatar avatar-40 rounded-circle border border-dotted border-theme">
                                    <span class="h4">+</span>
                                </div>
                                </div>
                            <div v-for="(transaction, index) in transactions.slice(0, 8)" :key="index" class="swiper-slide w-auto" role="group" style="margin-right: 20px;">
                                <div class="avatar avatar-40 rounded-circle coverimg" style="background-image: url('/assets/img/template/user-1.jpg');">
                                    <img src="/assets/img/template/user-1.jpg" alt="" style="display: none;">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card adminuiux-card overflow-hidden">
                        <div class="card-body p-0">
                            <ul class="list-group list-group-flush bg-none">
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
                
                <div class="col-12 col-md-6 col-xl-4 mb-3 mb-lg-4">
                    <div class="card adminuiux-card overflow-hidden">
                        <div class="card-header">
                            <div class="row gx-3 align-items-center">
                                <div class="col-auto">
                                    <span class="avatar avatar-40 rounded bg-theme-1-subtle text-theme-1">
                                        <i class="bi bi-wallet"></i>
                                    </span>
                                    </div>
                                <div class="col px-0">
                                    <h6>Мой кошелек</h6>
                                </div>
                                <div class="col-auto px-0">
                                    <select class="form-select form-select-sm">
                                        <option v-for="balance in balances" :key="balance.currency" :value="balance.currency">
                                            {{ balance.currency }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-auto">
                                    <button class="btn btn-sm btn-square btn-link" @click="updateBalances">
                                        <i class="bi bi-arrow-clockwise"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h2>$ {{ totalBalance.toFixed(2) }}</h2>
                            <p class="text-secondary">Общий чистый доход составляет $ {{ totalReceived.toFixed(2) }} <span class="text-success"><i class="bi bi-arrow-up-short"></i> 11.5%</span> увеличился на прошлой неделе</p>
                            <div class="summarychart height-120 w-100 mb-3">
                                <canvas id="areachartblue1" width="658" height="240"></canvas>
                            </div>
                        </div>
                                    </div>
                                </div>
                
                <div class="col-12 col-md-6 col-xl-4">
                    <div class="row gx-3 gx-lg-4">
                        <div class="col-12 mb-3 mb-lg-4">
                            <div class="card adminuiux-card">
                                <div class="card-body">
                                    <div class="row gx-3">
                                <div class="col">
                                            <h5>Пригласите друзей и заработайте</h5>
                                            <p class="text-secondary small">Попросите друга присоединиться к нам и заработайте 10% от прибыли, которую они получили в первый раз.</p>
                                            <RouterLink to="/referral" class="btn btn-sm btn-outline-theme my-1">Пригласить присоединиться</RouterLink>
                                </div>
                                <div class="col-auto">
                                            <div class="avatar avatar-60 rounded bg-theme-1-subtle text-theme-1">
                                                <i class="bi bi-send h1"></i>
                                </div>
                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="offcanvas offcanvas-bottom width-300 mx-auto rounded h-auto mb-3 mb-lg-4" tabindex="-1" data-bs-scroll="false" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                <div class="offcanvas-header justify-content-center">
                    <p class="offcanvas-title text-center" id="offcanvasBottomLabel">Сделать больше...</p>
                </div>
                <div class="offcanvas-body pb-0">
                    <div class="row gx-3 text-center align-items-center">
                        <div class="col-3 mb-3 mb-lg-4">
                            <RouterLink to="/pay" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Перевод" data-bs-original-title="Перевод">
                                <i class="bi bi-send"></i>
                            </RouterLink>
                        </div>
                        <div class="col-3 mb-3 mb-lg-4">
                            <RouterLink to="/withdraw" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Отправить деньги" data-bs-original-title="Отправить деньги">
                                <i class="bi bi-arrow-up-right"></i>
                            </RouterLink>
                        </div>
                        <div class="col-3 mb-3 mb-lg-4">
                            <RouterLink to="/topup" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Получить деньги" data-bs-original-title="Получить деньги">
                                <i class="bi bi-arrow-down-left"></i>
                            </RouterLink>
                        </div>
                        <div class="col-3 mb-3 mb-lg-4">
                            <RouterLink to="/topup" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Добавить деньги" data-bs-original-title="Добавить деньги">
                                <i class="bi bi-plus-lg"></i>
                            </RouterLink>
                        </div>
                        <div class="col-3 mb-3 mb-lg-4">
                            <RouterLink to="/convert" class="btn btn-lg btn-square btn-outline-theme" data-bs-toggle="tooltip" aria-label="Конвертировать" data-bs-original-title="Конвертировать">
                                <i class="bi bi-arrow-left-right"></i>
                            </RouterLink>
                        </div>
                        <div class="col-12 text-center mb-3 mb-lg-4 pt-3">
                            <button type="button" class="btn btn-sm btn-link theme-red" data-bs-dismiss="offcanvas" aria-label="Закрыть">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
