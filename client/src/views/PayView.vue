<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from '@/composables/useToast';
import apiService from '@/services/apiService';
import { authClient } from '@/lib/auth-client';

const { showToast } = useToast();
const session = authClient.useSession();

const cardNumber = ref('');
const amount = ref(100.00);
const fromCurrency = ref('RUB');
const toCurrency = ref('IMI');
const balances = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const showError = ref(false);

const loadBalances = async () => {
    try {
        balances.value = await apiService.getUserBalances();
    } catch (error) {
        console.error('Ошибка загрузки балансов:', error);
    }
};

const fromBalance = computed(() => {
    return balances.value.find(b => b.currency === fromCurrency.value);
});

const canSend = computed(() => {
    if (!fromBalance.value) return false;
    return fromBalance.value.balance >= amount.value;
});

const sendMoney = async () => {
    if (!cardNumber.value.trim()) {
        errorMessage.value = 'Введите номер карты';
        showError.value = true;
        return;
    }

    if (amount.value <= 0) {
        errorMessage.value = 'Сумма должна быть больше нуля';
        showError.value = true;
        return;
    }

    if (!canSend.value) {
        errorMessage.value = 'Недостаточно средств на балансе';
        showError.value = true;
        return;
    }

    try {
        loading.value = true;
        showError.value = false;
        errorMessage.value = '';

        await apiService.transferByCard({
            cardNumber: cardNumber.value.trim(),
            currency: fromCurrency.value,
            amount: amount.value,
        });

        showToast('Успех', `Перевод ${amount.value} ${fromCurrency.value} выполнен успешно`, 5000);
        await loadBalances();
        cardNumber.value = '';
        amount.value = 100.00;
    } catch (error) {
        errorMessage.value = error.error || 'Ошибка при переводе средств';
        showError.value = true;
        console.error('Ошибка перевода:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadBalances();
});
</script>

<template>
    <div class="container-fluid py-3">
        <div class="row gx-3 align-items-center page-title">
            <div class="col col-sm">
                <h5 class="mb-0">Отправить деньги</h5>
                <p class="text-secondary small">Мгновенный перевод средств контактам</p>
            </div>
        </div>
        <nav aria-label="breadcrumb" class="breadcrumb-theme mt-3 rounded d-none d-lg-block">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item bi">
                    <RouterLink to="/dashboard"><i class="bi bi-house-door me-2"></i> Главная</RouterLink>
                </li>
                <li class="breadcrumb-item bi active" aria-current="page">Отправить деньги</li>
            </ol>
        </nav>
    </div>

    <div class="container mt-3" id="main-content">
        <div class="row gx-3 gx-lg-4 justify-content-center minheight-dynamic" style="--mih-dynamic: calc(100vh - 215px - env(safe-area-inset-bottom) - env(safe-area-inset-top))">
            <div class="col-12 col-md-7 col-lg-6 col-xl-5 col-xxl-4 mb-auto">
                <div class="form-floating mb-3">
                    <input 
                        v-model="cardNumber" 
                        type="text" 
                        class="form-control" 
                        id="contact" 
                        placeholder="Введите номер карты..."
                        maxlength="19"
                    />
                    <label for="contact">Номер карты получателя</label>
                </div>

                <input 
                    v-model.number="amount" 
                    type="number" 
                    class="form-control form-control-lg text-center mb-3 fs-2 fw-bold" 
                    id="ihavei" 
                    placeholder="Сумма..." 
                    step="0.01"
                    min="0.01"
                />
                
                <div class="row mb-4">
                    <div class="col">
                        <div class="form-floating mb-1">
                            <select v-model="fromCurrency" class="form-select" id="ihavecurrencyi">
                                <option v-for="balance in balances" :key="balance.currency" :value="balance.currency">
                                    {{ balance.currency }} Кошелек
                                </option>
                            </select>
                            <label for="ihavecurrencyi">Откуда...</label>
                        </div>
                        <p class="small text-secondary text-center">
                            {{ fromBalance ? parseFloat(fromBalance.balance).toFixed(2) : '0.00' }} {{ fromCurrency }}
                        </p>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-square btn-theme mt-2" @click="[fromCurrency, toCurrency] = [toCurrency, fromCurrency]">
                            <i class="bi bi-arrow-left-right"></i>
                        </button>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-1">
                            <select v-model="toCurrency" class="form-select" id="ihavecurrency2i">
                                <option v-for="balance in balances" :key="balance.currency" :value="balance.currency">
                                    {{ balance.currency }}
                                </option>
                            </select>
                            <label for="ihavecurrency2i">Отправить в...</label>
                        </div>
                        <p class="small text-secondary text-center">
                            {{ amount.toFixed(2) }} {{ toCurrency }}
                        </p>
                    </div>
                </div>
                
                <div class="text-center">
                    <h5 class="fw-normal"><b class="fw-bold">Отлично!</b> Вы собираетесь отправить</h5>
                    <h1 class="mb-0 text-theme-1">{{ amount.toFixed(2) }}</h1>
                    <p class="text-secondary small">в {{ toCurrency }}</p>
                </div>

                <div v-if="showError" class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                    <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка!</strong><br>
                    <small>{{ errorMessage }}</small>
                    <button type="button" class="btn-close" @click="showError = false" data-bs-dismiss="alert" aria-label="Закрыть"></button>
                </div>

                <div v-else-if="!canSend && fromBalance" class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                    <strong><i class="bi bi-exclamation-triangle me-1"></i> Недостаточно средств!</strong><br>
                    <small>На вашем счете недостаточно средств для отправки. Пожалуйста, пополните баланс или выберите другой кошелек.</small>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
                </div>
            </div>
            
            <div class="col-12 mb-3 mb-lg-4"></div>
            <div class="col-12 col-md-auto mx-auto mb-3 mb-lg-4 mt-auto">
                <button 
                    @click="sendMoney" 
                    class="btn btn-theme w-100" 
                    :disabled="loading || !canSend || !cardNumber.trim()"
                >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Отправить сейчас
                </button>
            </div>
        </div>
    </div>
</template>
