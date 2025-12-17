<script setup>
import { ref, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import apiService from '@/services/apiService';

const { showToast } = useToast();

// Состояния для управления данными вывода
const amount = ref(100.00);
const currency = ref('RUB');
const paymentMethod = ref('card'); // по умолчанию "Перевод на карту"
const errorMessage = ref('');
const showError = ref(false);

// Вычисляемое свойство для отображения типа кошелька
const walletType = computed(() => {
    return currency.value === 'RUB' ? 'RUB кошелек' : 'IMI кошелек';
});
// Обработчик для кнопки "Вывести"
const handleWithdraw = async () => {
    // Сначала скрываем ошибку
    showError.value = false;
    errorMessage.value = '';

    try {
        // Подготовим данные для отправки на сервер в соответствии со схемой
        const requestData = {
            currency: currency.value,
            amount: parseFloat(amount.value)
        };

        // Отправляем запрос на сервер
        const response = await apiService.walletWithdraw(requestData);

        // При успешном ответе показываем уведомление
        // showToast('Успех', `Баланс успешно выведен на ${amount.value} ${currency.value}!`, 5000);
    } catch (error) {
        console.log('error', error)
        // В случае ошибки показываем сообщение об ошибке
        if (error && error.error) {
            // Если сервер вернул конкретное сообщение об ошибке
            errorMessage.value = error.error;
        } else {
            errorMessage.value = 'Не удалось вывести средства. Попробуйте ещё раз.';
        }

        showError.value = true;
        console.error('Ошибка при выводе:', error);
    }
};

// Обработчик изменения суммы
const handleAmountChange = () => {
    // Убедимся, что сумма положительная
    if (amount.value <= 0) {
        amount.value = 1; // минимальная сумма 1
    }
};
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <!-- page title -->
        <div class="container-fluid py-3">
            <div class="row gx-3 align-items-center page-title">
                <div class="col col-sm">
                    <h5 class="mb-0">Вывод денег</h5>
                    <p class="text-secondary small">
                        Быстрый вывод денег
                    </p>
                </div>
            </div>
            <nav aria-label="breadcrumb" class="breadcrumb-theme mt-3 rounded d-none d-lg-block">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item bi">
                        <RouterLink to="/dashboard"><i class="bi bi-house-door me-2"></i> Главная</RouterLink>
                    </li>
                    <li class="breadcrumb-item bi active" aria-current="page">
                        Вывод баланса
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
                    <div class="row mb-4">
                        <div class="col">
                            <input v-model.number="amount" @input="handleAmountChange" type="number"
                                class="form-control form-control-lg text-center" placeholder="Add Amount..." />
                        </div>
                        <div class="col-auto">
                            <select v-model="currency" class="form-select form-select-lg">
                                <option value="RUB">RUB</option>
                                <option value="IMI">IMI</option>

                            </select>
                        </div>
                    </div>
                    <div class="text-center mb-4">
                        <h5 class="fw-normal">
                            Вы получите
                        </h5>
                        <h1 class="mb-0 text-theme-1">{{ amount }}</h1>
                        <p class="text-secondary small">в {{ walletType }}</p>
                    </div>
                    <h6>Способ получения</h6>
                    <ul class="list-group adminuiux-list-group">
                        <li class="list-group-item">
                            <input v-model="paymentMethod" class="form-check-input me-1" type="radio"
                                name="listGroupRadio" value="card" id="firstRadio2" />
                            <label class="form-check-label stretched-link" for="firstRadio2">Перевод на
                                карту</label>
                        </li>
                        <li class="list-group-item">
                            <input v-model="paymentMethod" class="form-check-input me-1" type="radio"
                                name="listGroupRadio" value="sbp" id="secondRadio2" />
                            <label class="form-check-label stretched-link" for="secondRadio2">СБП</label>
                        </li>
                        <li class="list-group-item">
                            <input v-model="paymentMethod" class="form-check-input me-1" type="radio"
                                name="listGroupRadio" value="crypto" id="thirdRadio2" />
                            <label class="form-check-label stretched-link" for="thirdRadio2">Криптовалюта</label>
                        </li>
                    </ul>


                    <div v-if="showError" class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                        <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка</strong>
                        <br />
                        {{ errorMessage }}
                        <button type="button" class="btn-close" @click="showError = false" data-bs-dismiss="alert"
                            aria-label="Close"></button>
                    </div>
                    <div class="col-12 mb-3 mb-lg-4"></div>
                    <div class="col-12 col-md-auto mx-auto mb-3 mb-lg-4 mt-auto">
                        <button @click="handleWithdraw" class="btn btn-theme w-10">Вывести</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
