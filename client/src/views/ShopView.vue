<script setup>
import { ref } from 'vue';
import apiService from '@/services/apiService';

// Состояния для отображения ошибок
const errorMessage = ref('');
const showError = ref(false);

// Функция покупки
const buy = async (productName = 'Товар', price = 1000, currency = 'RUB') => {
    // Сбрасываем предыдущую ошибку
    showError.value = false;
    errorMessage.value = '';

    try {
        // Подготовим данные для отправки на сервер в соответствии со схемой
        const requestData = {
            currency: currency,
            amount: price,
            description: productName
        };

        // Отправляем запрос на сервер
        const response = await apiService.walletPurchase(requestData);

        // Можно добавить уведомление об успешной покупке
        console.log('Покупка прошла успешно', response);
    } catch (error) {
        // В случае ошибки показываем сообщение об ошибке
        if (error && error.error) {
            // Если сервер вернул конкретное сообщение об ошибке
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
        <!-- Content  -->
        <div class="container mt-3" id="main-content">

            <div v-if="showError" class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка</strong>
                <br />
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="showError = false" data-bs-dismiss="alert"
                    aria-label="Close"></button>
            </div>


            <!-- products -->
            <div class="row gx-3 gx-lg-4">
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card mb-3 mb-lg-4 style-none">
                        <div class="card-body p-1 position-relative">
                            <div class="position-absolute start-0 top-0 m-2 z-index-1">
                                <div class="badge badge-sm text-bg-theme-1 theme-green">
                                    26% СКИДКА
                                </div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1 ">
                                <button class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>

                            <figure class="w-100 height-250 rounded coverimg">
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
                                    <button @click="buy('iPhone 16', 125000, 'RUB')"
                                        class="btn btn-sm btn-link btn-square text-color-theme">
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
                                <div class="badge badge-sm text-bg-theme-1 theme-red">
                                    10% СКИДКА
                                </div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1 ">
                                <button
                                    class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red active">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>

                            <figure class="w-100 height-250 rounded coverimg">
                                <img src="/assets/img/template/restaurant02.jpg" alt="" class="w-100">
                            </figure>

                        </div>
                        <div class="card-body pt-2">
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <p class="small text-secondary mb-0">iPhone 16</p>
                                    <h6>₽ 165 000</h6>
                                </div>
                                <div class="col-auto px-0">
                                    <button @click="buy('iPhone 16', 165000, 'RUB')"
                                        class="btn btn-sm btn-link btn-square text-color-theme">
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
                                <div class="badge badge-sm text-bg-theme-1 theme-green">
                                    15% СКИДКА
                                </div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1 ">
                                <button class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>

                            <figure class="w-100 height-250 rounded coverimg">
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
                                    <button @click="buy('iPhone 16 Air', 78000, 'RUB')"
                                        class="btn btn-sm btn-link btn-square text-color-theme">
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
                                <div class="badge badge-sm text-bg-theme-1 theme-yellow">
                                    20% СКИДКА
                                </div>
                            </div>
                            <div class="position-absolute end-0 top-0 p-2 z-index-1 ">
                                <button class="btn btn-sm btn-link btn-square roudned-circle text-bg-theme-1 theme-red">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>

                            <figure class="w-100 height-250 rounded coverimg">
                                <img src="/assets/img/template/restaurant01.jpg" alt="" class="w-100">
                            </figure>

                        </div>
                        <div class="card-body pt-2">
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <p class="small text-secondary mb-0">iPhone 16 Pro</p>
                                    <h6>₽ 180 000</h6>
                                </div>
                                <div class="col-auto px-0">
                                    <button @click="buy('iPhone 16 Pro', 180000, 'RUB')"
                                        class="btn btn-sm btn-link btn-square text-color-theme">
                                        <i class="bi bi-bag-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </main>
</template>

<style>
.height-250 {
    height: 200px !important;

}
</style>