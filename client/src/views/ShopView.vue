<script setup>
import { ref } from 'vue';
import apiService from '@/services/apiService';

const errorMessage = ref('');
const showError = ref(false);

const buy = async (productName = 'Товар', price = 1000, currency = 'RUB') => {
    showError.value = false;
    errorMessage.value = '';

    try {
        const requestData = {
            currency: currency,
            amount: price,
            description: productName
        };

        const response = await apiService.walletPurchase(requestData);
        console.log('Покупка прошла успешно', response);
    } catch (error) {
        if (error && error.error) {
            errorMessage.value = error.error;
        } else {
            errorMessage.value = 'Не удалось выполнить покупку. Попробуйте ещё раз.';
        }

        showError.value = true;
        console.error('Ошибка при покупке:', error);
    }
}
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <div class="container mt-3" id="main-content">

            <div v-if="showError" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка</strong>
                <br />
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="showError = false" data-bs-dismiss="alert"
                    aria-label="Close"></button>
            </div>

            <div class="row gx-3 gx-lg-4 align-items-center mb-4 mb-lg-5">
                <div class="col col-sm">
                    <div class="input-group">
                        <input type="search" class="form-control" placeholder="Поиск...">
                        <button class="btn btn-link btn-square input-group-text border" type="button">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div class="col-auto">
                    <button class="btn btn-link btn-square" data-bs-toggle="offcanvas" data-bs-target="#filter"
                        data-bs-placement="end">
                        <i class="bi bi-filter"></i>
                    </button>
                </div>
            </div>

            <div class="swiper swipernavpagination mb-3 mb-lg-4">
                <div class="swiper-wrapper">
                    <div class="swiper-slide w-auto pb-3 pb-lg-4">
                        <div class="card adminuiux-card overflow-hidden width-280">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <div class="position-relative">
                                            <h3 class="mb-0">20% СКИДКА</h3>
                                            <p class="text-secondary">Электроника</p>
                                            <button class="copy-text btn btn-sm btn-rounded btn-outline-dashed border-theme-1 text-theme-1">PROMO20</button>
                                        </div>
                                    </div>
                                    <div class="col-auto position-relative">
                                        <figure class="avatar avatar-100 coverimg">
                                            <img src="/assets/img/template/restaurant01.png" class="mw-100" alt="">
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide w-auto pb-3 pb-lg-4">
                        <div class="card adminuiux-card bg-theme-1 overflow-hidden width-280">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <div class="position-relative">
                                            <h3 class="mb-0">11% СКИДКА</h3>
                                            <p>Гаджеты</p>
                                            <button class="copy-text btn btn-sm btn-rounded btn-outline-dashed text-white border-white">GADGET11</button>
                                        </div>
                                    </div>
                                    <div class="col-auto position-relative">
                                        <figure class="avatar avatar-100 coverimg">
                                            <img src="/assets/img/template/restaurant03.png" class="mw-100" alt="">
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-slide w-auto pb-3 pb-lg-4">
                        <div class="card adminuiux-card bg-theme-1 overflow-hidden width-280 theme-black">
                            <div class="card-body">
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <div class="position-relative">
                                            <h3 class="mb-0">15% СКИДКА</h3>
                                            <p>Аксессуары</p>
                                            <button class="copy-text btn btn-sm btn-rounded btn-outline-dashed text-white border-white">ACCESS15</button>
                                        </div>
                                    </div>
                                    <div class="col-auto position-relative">
                                        <figure class="avatar avatar-100 coverimg">
                                            <img src="/assets/img/template/restaurant02.png" class="mw-100" alt="">
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination line bottom-0"></div>
            </div>

            <div class="swiper swipernav mb-3 mb-lg-4" data-space-between="10">
                <div class="swiper-wrapper">
                    <div class="swiper-slide w-auto">
                        <button class="btn btn-outline-theme active">Все</button>
                    </div>
                    <div class="swiper-slide w-auto">
                        <button class="btn btn-outline-theme">iPhone</button>
                    </div>
                    <div class="swiper-slide w-auto">
                        <button class="btn btn-outline-theme">MacBook</button>
                    </div>
                    <div class="swiper-slide w-auto">
                        <button class="btn btn-outline-theme">iPad</button>
                    </div>
                    <div class="swiper-slide w-auto">
                        <button class="btn btn-outline-theme">Watch</button>
                    </div>
                    <div class="swiper-slide w-auto">
                        <button class="btn btn-outline-theme">AirPods</button>
                    </div>
                    <div class="swiper-slide w-auto">
                        <button class="btn btn-outline-theme">Аксессуары</button>
                    </div>
                </div>
            </div>

            <div class="card adminuiux-card mb-3 mb-lg-4 mt-4">
                <div class="card-body">
                    <div class="row gx-2 gx-lg-4 align-items-center">
                        <div class="col">
                            <img src="/assets/img/template/visa-c.png" alt="" class="mb-2"><br>
                            <h4>15% СКИДКА<br><small class="fw-normal text-secondary">По карте</small></h4>
                        </div>
                        <div class="col-auto mt--25">
                            <img src="/assets/img/template/restaurant04.png" alt="" class="width-100 mb-3">
                        </div>
                        <div class="col text-end">
                            <h4 class="mb-1">₽ 150 000</h4>
                            <p class="fs-12 text-secondary">Экономия с<br>кредитной картой*</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row gx-3 gx-lg-4">
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card mb-3 mb-lg-4 style-none">
                        <div class="card-body p-1 position-relative">
                            <div class="position-absolute start-0 top-0 m-2 z-index-1">
                                <div class="badge badge-sm text-bg-theme-1 theme-green">26% СКИДКА</div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1">
                                <button class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>
                            <figure class="w-100 height-150 rounded coverimg">
                                <img src="/assets/img/template/restaurant01.jpg" alt="" class="w-100">
                            </figure>
                        </div>
                        <div class="card-body pt-2">
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <p class="small text-secondary mb-0">iPhone 16</p>
                                    <h6>₽ 125 000</h6>
                                </div>
                                <div class="col-auto px-0">
                                    <button @click="buy('iPhone 16', 125000, 'RUB')" class="btn btn-sm btn-link btn-square text-color-theme">
                                        <i class="bi bi-bag-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card mb-3 mb-lg-4 style-none">
                        <div class="card-body p-1 position-relative">
                            <div class="position-absolute start-0 top-0 m-2 z-index-1">
                                <div class="badge badge-sm text-bg-theme-1 theme-red">10% СКИДКА</div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1">
                                <button class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red active">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>
                            <figure class="w-100 height-150 rounded coverimg">
                                <img src="/assets/img/template/restaurant02.jpg" alt="" class="w-100">
                            </figure>
                        </div>
                        <div class="card-body pt-2">
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <p class="small text-secondary mb-0">iPhone 16 Pro</p>
                                    <h6>₽ 165 000</h6>
                                </div>
                                <div class="col-auto px-0">
                                    <button @click="buy('iPhone 16 Pro', 165000, 'RUB')" class="btn btn-sm btn-link btn-square text-color-theme">
                                        <i class="bi bi-bag-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card mb-3 mb-lg-4 style-none">
                        <div class="card-body p-1 position-relative">
                            <div class="position-absolute start-0 top-0 m-2 z-index-1">
                                <div class="badge badge-sm text-bg-theme-1 theme-green">15% СКИДКА</div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1">
                                <button class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>
                            <figure class="w-100 height-150 rounded coverimg">
                                <img src="/assets/img/template/restaurant03.jpg" alt="" class="w-100">
                            </figure>
                        </div>
                        <div class="card-body pt-2">
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <p class="small text-secondary mb-0">iPhone 16 Air</p>
                                    <h6>₽ 78 000</h6>
                                </div>
                                <div class="col-auto px-0">
                                    <button @click="buy('iPhone 16 Air', 78000, 'RUB')" class="btn btn-sm btn-link btn-square text-color-theme">
                                        <i class="bi bi-bag-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card mb-3 mb-lg-4 style-none">
                        <div class="card-body p-1 position-relative">
                            <div class="position-absolute start-0 top-0 m-2 z-index-1">
                                <div class="badge badge-sm text-bg-theme-1 theme-yellow">20% СКИДКА</div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1">
                                <button class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>
                            <figure class="w-100 height-150 rounded coverimg">
                                <img src="/assets/img/template/restaurant04.jpg" alt="" class="w-100">
                            </figure>
                        </div>
                        <div class="card-body pt-2">
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <p class="small text-secondary mb-0">iPhone 16 Pro Max</p>
                                    <h6>₽ 180 000</h6>
                                </div>
                                <div class="col-auto px-0">
                                    <button @click="buy('iPhone 16 Pro Max', 180000, 'RUB')" class="btn btn-sm btn-link btn-square text-color-theme">
                                        <i class="bi bi-bag-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row gx-3 gx-lg-4">
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card border-0 position-relative overflow-hidden bg-theme-1 p-1 mb-3 mb-lg-4">
                        <div class="coverimg height-300 width-300 position-absolute top-0 start-0 translate-middle">
                            <img src="/assets/img/template/restaurant01.png" alt="">
                        </div>
                        <div class="text-end p-3 z-index-1">
                            <h1 class="mb-1">10% СКИДКА</h1>
                            <h2 class="fw-normal">По кредитным картам</h2>
                        </div>
                        <div class="card adminuiux-card border-0 bg-none text-white blur-overlay overflow-hidden position-relative" style="--bs-border-radius: 1.15rem;">
                            <div class="card-body p-2 z-index-1">
                                <div class="row gx-2 align-items-center">
                                    <div class="col-auto">
                                        <div class="avatar avatar-50 rounded border coverimg">
                                            <img src="/assets/img/template/restaurant02.jpg" alt="">
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="avatar avatar-50 rounded border coverimg">
                                            <img src="/assets/img/template/restaurant03.jpg" alt="">
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <div class="avatar avatar-50 rounded border coverimg">
                                            <img src="/assets/img/template/restaurant01.jpg" alt="">
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <h6 class="mb-0 small">90+</h6>
                                        <p class="opacity-75 small mb-0">Товаров</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card adminuiux-card bg-theme-1 mb-3 mb-lg-4 overflow-hidden">
                        <div class="coverimg avatar avatar-200 position-absolute top-50 start-100 translate-middle">
                            <img src="/assets/img/template/restaurant03.png" alt="">
                        </div>
                        <div class="card-body z-index-1">
                            <div class="row gx-3">
                                <div class="col-9 align-self-center">
                                    <h1 class="mb-3"><span class="fw-normal">15% СКИДКА</span><br>Подарочная карта</h1>
                                    <p class="mb-1">Спасибо за покупки! Вы получили подарочную карту.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4">
                    <ul class="list-group bg-none mb-3 mb-lg-4">
                        <li class="list-group-item">
                            <div class="row gx-3">
                                <div class="col-auto">
                                    <div class="avatar avatar-50 rounded coverimg">
                                        <img src="/assets/img/template/restaurant01.png" alt="">
                                    </div>
                                </div>
                                <div class="col align-self-center ps-0">
                                    <p class="opacity-75 small mb-0">MacBook</p>
                                    <p class="mb-0">MacBook Air M3</p>
                                </div>
                                <div class="col align-self-center text-end">
                                    <p class="opacity-75 small mb-0">Хит</p>
                                    <p class="mb-0">₽ 125 000</p>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="row gx-3">
                                <div class="col-auto">
                                    <div class="avatar avatar-50 rounded coverimg">
                                        <img src="/assets/img/template/restaurant02.png" alt="">
                                    </div>
                                </div>
                                <div class="col align-self-center ps-0">
                                    <p class="opacity-75 small mb-0">iPad</p>
                                    <p class="mb-0">iPad Pro M4</p>
                                </div>
                                <div class="col align-self-center text-end">
                                    <p class="opacity-75 small mb-0">Тренд</p>
                                    <p class="mb-0">₽ 150 000</p>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="row gx-3">
                                <div class="col-auto">
                                    <div class="avatar avatar-50 rounded coverimg">
                                        <img src="/assets/img/template/restaurant03.png" alt="">
                                    </div>
                                </div>
                                <div class="col align-self-center ps-0">
                                    <p class="opacity-75 small mb-0">Watch</p>
                                    <p class="mb-0">Apple Watch Ultra</p>
                                </div>
                                <div class="col align-self-center text-end">
                                    <p class="opacity-75 small mb-0">20% СКИДКА</p>
                                    <p class="mb-0">₽ 85 000</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </main>
</template>
