<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();
import apiService from '@/services/apiService';

const referrer = ref(null);
const loading = ref(true);

const update = async () => {
    try {
        loading.value = true;
        referrer.value = await apiService.getUserReferrer();
    } catch (error) {
        console.error('Ошибка загрузки реферера:', error);
        referrer.value = null;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    update();
});
</script>

<template>
    <div class="card adminuiux-card">
        <div class="card-header bg-transparent border-bottom">
            <h6 class="mb-0">
                <i class="bi bi-person-check me-2"></i>Ваш реферер
            </h6>
        </div>
        <div class="card-body">
            <div v-if="loading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary"></div>
            </div>
            <div v-else-if="referrer && referrer.email">
                <div class="d-flex align-items-center mb-3">
                    <div class="avatar avatar-60 rounded-circle bg-theme-1-subtle text-theme-1 d-flex align-items-center justify-content-center me-3">
                        <i class="bi bi-person-fill" style="font-size: 1.5rem;"></i>
                    </div>
                    <div class="flex-grow-1">
                        <h5 class="mb-1">
                            {{ referrer.name && referrer.name !== '-' ? referrer.name : referrer.email }}
                        </h5>
                        <p class="text-muted small mb-0">
                            <i class="bi bi-envelope me-1"></i>{{ referrer.email }}
                        </p>
                    </div>
                </div>
                <div v-if="referrer.phone" class="mb-2">
                    <p class="text-muted small mb-0">
                        <i class="bi bi-telephone me-2"></i>
                        <strong>Телефон:</strong> {{ referrer.phone }}
                    </p>
                </div>
                <div v-if="referrer.referralCode" class="mt-3 pt-3 border-top">
                    <p class="text-muted small mb-1">Реферальный код:</p>
                    <code class="bg-light px-2 py-1 rounded">{{ referrer.referralCode }}</code>
                </div>
            </div>
            <div v-else class="text-center py-4">
                <div class="avatar avatar-60 rounded-circle bg-light text-muted d-flex align-items-center justify-content-center mx-auto mb-3">
                    <i class="bi bi-person-x" style="font-size: 1.5rem;"></i>
                </div>
                <p class="text-muted mb-0">У вас нет реферера</p>
                <p class="text-muted small mt-2">Вы зарегистрировались самостоятельно</p>
            </div>
        </div>
    </div>
</template>
