<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import IncomeByLevels from '@/components/IncomeByLevels.vue'
import MyReferrer from '@/components/MyReferrer.vue'
import ReferralTree from '@/components/ReferralTree.vue'
import { authClient } from "@/lib/auth-client";
import apiService from '@/services/apiService';

interface ReferralData {
    directReferrals: any[];
    directReferralsCount: number;
    upline: any[];
    referralTree: any[];
}

const session = authClient.useSession();
const loading = ref(true);
const referralData = ref<ReferralData | null>(null);
const incomeByLevel = ref<any[]>([]);

const referralLink = computed(() => {
    const user = session.value?.data?.user as any;
    if (user?.referralCode) {
        const baseUrl = window.location.origin;
        return `${baseUrl}/ref/${user.referralCode}`;
    }
    return '';
});

const loadData = async () => {
    loading.value = true;
    try {
        const [referrals, income] = await Promise.all([
            apiService.getMyReferrals(),
            apiService.getIncomeByLevel()
        ]);
        referralData.value = referrals;
        incomeByLevel.value = income;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    } finally {
        loading.value = false;
    }
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    const dateValue = typeof timestamp === 'number' 
        ? (timestamp < 10000000000 ? timestamp * 1000 : timestamp)
        : timestamp;
    try {
        return new Date(dateValue).toLocaleDateString("ru-RU", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch {
        return "-";
    }
};

const btnShareClick = () => {
    if (navigator.share) {
        navigator
            .share({
                title: "Присоединяйся к нам",
                text: "Регистрируйся по моей ссылке и начинай зарабатывать",
                url: referralLink.value,
            })
            .then(() => console.log("Успешно поделились"))
            .catch((error) => console.log("Ошибка:", error));
    } else {
        console.log("Web Share API не поддерживается в этом браузере");
    }
};

const btnCopyToClipboardClick = async () => {
    try {
        await navigator.clipboard.writeText(referralLink.value);
        alert('Ссылка скопирована!');
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
}

onMounted(() => {
    loadData();
});
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <div class="container pt-4 mt-3" id="main-content">
            <div class="row mb-4">
                <div class="col-12">
                    <h4 class="mb-0">Реферальная программа</h4>
                    <p class="text-muted">Приглашайте друзей и зарабатывайте</p>
                </div>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 text-muted">Загрузка данных...</p>
            </div>

            <div v-else>
                <div class="row mb-4">
                    <div class="col-12 col-md-8 mb-3">
                        <div class="card adminuiux-card">
                            <div class="card-body">
                                <h5 class="mb-3">
                                    <i class="bi bi-link-45deg me-2"></i>Ваша реферальная ссылка
                                </h5>
                                <p class="text-secondary small mb-3">
                                    Предложите другу присоединиться к нам и заработайте процент от его покупок
                                </p>
                                <div class="input-group mb-2">
                                    <input 
                                        type="text" 
                                        class="form-control border-theme-1"
                                        :value="referralLink" 
                                        disabled 
                                    />
                                    <button 
                                        class="btn btn-outline-theme" 
                                        type="button"
                                        @click="btnCopyToClipboardClick"
                                    >
                                        <i class="bi bi-copy"></i> Копировать
                                    </button>
                                </div>
                                <button type="button" class="btn btn-outline-info" @click="btnShareClick">
                                    <i class="bi bi-share"></i> Поделиться ссылкой
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-4 mb-3">
                        <div class="card adminuiux-card bg-primary text-white">
                            <div class="card-body text-center">
                                <h2 class="mb-0">{{ referralData?.directReferralsCount || 0 }}</h2>
                                <p class="mb-0">Приглашено друзей</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-4">
                    <div class="col-12 col-md-6 mb-3">
                        <MyReferrer />
                    </div>

                    <div class="col-12 col-md-6 mb-3">
                        <div class="card adminuiux-card">
                            <div class="card-header">
                                <h6 class="mb-0">Линия наверх</h6>
                            </div>
                            <div class="card-body">
                                <div v-if="referralData?.upline && referralData.upline.length > 0">
                                    <div v-for="(user, index) in referralData.upline" :key="user.id" class="mb-3 pb-3 border-bottom">
                                        <div class="d-flex align-items-center">
                                            <div class="avatar avatar-40 rounded-circle bg-theme-1-subtle text-theme-1 d-flex align-items-center justify-content-center me-3">
                                                <span class="fw-bold">{{ user.level }}</span>
                                            </div>
                                            <div class="flex-grow-1">
                                                <h6 class="mb-1">{{ user.name || user.email }}</h6>
                                                <p class="small text-muted mb-0">
                                                    Уровень {{ user.level }} • {{ user.email }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center text-muted py-3">
                                    <i class="bi bi-info-circle me-2"></i>
                                    У вас нет реферера
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card adminuiux-card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h6 class="mb-0">
                                    <i class="bi bi-diagram-3 me-2"></i>
                                    Дерево рефералов ({{ referralData?.directReferralsCount || 0 }} прямых)
                                </h6>
                            </div>
                            <div class="card-body">
                                <ReferralTree :tree="referralData?.referralTree || []" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <IncomeByLevels />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style></style>
