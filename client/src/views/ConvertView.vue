<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from '@/composables/useToast';
import apiService from '@/services/apiService';

const { showToast } = useToast();
// Состояния для управления данными конвертации
const amount = ref(100.00);
const fromCurrency = ref('RUB');
const toCurrency = ref('IMI');
const exchangeRate = ref(2); // 1 RUB = 1.38 IMI
const convertedAmount = ref(132.00);

const errorMessage = ref('');
const showError = ref(false);

// Обновляем конвертированную сумму при изменении входных данных
const updateConvertedAmount = () => {
    // Определяем текущий курс в зависимости от направления обмена
    let currentRate = exchangeRate.value;

    // Если конвертируем из IMI в RUB, используем обратный курс
    if (fromCurrency.value === 'IMI' && toCurrency.value === 'RUB') {
        currentRate = 1 / exchangeRate.value;
    }

    convertedAmount.value = (amount.value * currentRate).toFixed(2);
};

// Функция для переключения валют
const swapCurrencies = () => {
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    updateConvertedAmount();
};

// Обновляем валюты при изменении одной из них
const handleFromCurrencyChange = () => {
    if (fromCurrency.value === toCurrency.value) {
        // Если валюты совпадают, меняем вторую на другую доступную
        toCurrency.value = fromCurrency.value === 'RUB' ? 'IMI' : 'RUB';
    }
    updateConvertedAmount();
};

const handleToCurrencyChange = () => {
    if (fromCurrency.value === toCurrency.value) {
        // Если валюты совпадают, меняем первую на другую доступную
        fromCurrency.value = toCurrency.value === 'RUB' ? 'IMI' : 'RUB';
    }
    updateConvertedAmount();
};
// Функция обработки обмена
const handleExchange = async () => {
    // Сначала скрываем ошибку
    showError.value = false;
    errorMessage.value = '';

    try {
        // Подготовим данные для отправки на сервер в соответствии со схемой
        const requestData = {
            fromCurrency: fromCurrency.value,
            toCurrency: toCurrency.value,
            amount: parseFloat(amount.value),
            rate: fromCurrency.value == 'IMI' ? 1 / exchangeRate.value : exchangeRate.value
        };

        // Отправляем запрос на сервер
        const response = await apiService.walletConvert(requestData);

        // При успешном ответе показываем уведомление
        // showToast('Успех', `Обмен ${amount.value} ${fromCurrency.value} на ${convertedAmount.value} ${toCurrency.value} прошёл успешно!`, 5000);
    } catch (error) {
        // В случае ошибки показываем сообщение об ошибке
        if (error && error.error) {
            // Если сервер вернул конкретное сообщение об ошибке
            errorMessage.value = error.error;
        } else {
            errorMessage.value = 'Не удалось выполнить обмен. Попробуйте ещё раз.';
        }

        showError.value = true;
        console.error('Ошибка при обмене:', error);
    }
};

// Обновляем конвертированную сумму при изменении входных данных
onMounted(() => {
    updateConvertedAmount();
});

// Наблюдаем за изменениями для пересчета
const watchInputs = () => {
    updateConvertedAmount();
};
</script>

<template>
    <!-- page title -->
        <div class="container-fluid py-3">
            <div class="row gx-3 align-items-center page-title">
                <div class="col col-sm">
                    <h5 class="mb-0">Конвертация</h5>
                    <p class="text-secondary small">Моментальный обмен</p>
                </div>
            </div>
            <nav aria-label="breadcrumb" class="breadcrumb-theme mt-3 rounded d-none d-lg-block">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item bi">
                        <RouterLink to="/dashboard"><i class="bi bi-house-door me-2"></i> Главная</RouterLink>
                    </li>
                    <li class="breadcrumb-item bi active" aria-current="page">
                        Конвертер валют
                    </li>
                </ol>
            </nav>
        </div>
        <!-- Content  -->
        <div class="container mt-3" id="main-content">
            <div class="row gx-3 gx-lg-4 justify-content-center minheight-dynamic" style="
                    --mih-dynamic: calc(
                        100vh - 215px - env(safe-area-inset-bottom) -
                            env(safe-area-inset-top)
                    );
                ">
                <div class="col-12 col-md-7 col-lg-6 col-xl-5 col-xxl-4 mb-auto">
                    <input v-model="amount" @input="updateConvertedAmount" type="number"
                        class="form-control form-control-lg text-center mb-3 fs-2 fw-bold" id="ihave"
                        placeholder="Convert Amount..." />
                    <div class="row gx-3 mb-3">
                        <div class="col">
                            <div class="form-floating mb-1">
                                <select v-model="fromCurrency" @change="handleFromCurrencyChange" class="form-select"
                                    id="ihavecurrency">
                                    <option value="RUB">RUB</option>
                                    <option value="IMI">IMI</option>

                                </select>
                                <label for="ihavecurrency">Отдам...</label>
                            </div>
                            <p class="small text-secondary text-center">
                                1.00 {{ fromCurrency }}
                            </p>
                        </div>
                        <div class="col-auto">
                            <button @click="swapCurrencies" class="btn btn-square btn-theme mt-2">
                                <i class="bi bi-arrow-left-right"></i>
                            </button>
                        </div>
                        <div class="col">
                            <div class="form-floating mb-1">
                                <select v-model="toCurrency" @change="handleToCurrencyChange" class="form-select"
                                    id="ihavecurrency2">
                                    <option value="IMI" selected>IMI</option>
                                    <option value="RUB">RUB</option>

                                </select>
                                <label for="ihavecurrency2">Получу...</label>
                            </div>
                            <p class="small text-secondary text-center">
                                {{ exchangeRate.toFixed(2) }} {{ toCurrency }}
                            </p>
                        </div>
                    </div>
                    <div class="text-center">
                        <h5 class="fw-normal">
                            Вы получите
                        </h5>
                        <h1 class="text-theme-1">{{ convertedAmount }}</h1>
                        <p class="text-secondary small mb-3">
                            {{ toCurrency }} coins
                        </p>
                    </div>

                    <div v-if="showError" class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                        <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка</strong>
                        <br />
                        {{ errorMessage }}
                        <button type="button" class="btn-close" @click="showError = false" data-bs-dismiss="alert"
                            aria-label="Close"></button>
                    </div>
                </div>
                <div class="col-12 mb-3 mb-lg-4"></div>

                <div class="col-12 col-md-auto mx-auto mb-3 mb-lg-4 mt-auto">
                    <button @click="handleExchange" class="btn btn-theme w-100">Обменять</button>
                </div>
            </div>
        </div>
</template>
