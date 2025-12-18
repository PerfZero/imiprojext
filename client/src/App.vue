<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import AppLayout from "@/AppLayout.vue";
import "/assets/js/template/template-dashboard.js?url";

const isLoading = ref(true);
const router = useRouter();

onMounted(() => {
    router.isReady().then(() => {
        setTimeout(() => {
            isLoading.value = false;
        }, 300);
    }).catch(() => {
        isLoading.value = false;
    });
});
</script>

<template>
    <div v-if="isLoading" class="app-loader">
        <div class="loader-container">
            <div class="mb-4">
                <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem; border-width: 0.3rem;">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
            </div>
            <h4 class="mb-2">IMI CLUB</h4>
            <p class="text-muted mb-0">Загрузка приложения...</p>
        </div>
    </div>
    <AppLayout v-else>
        <RouterView />
    </AppLayout>

    <!-- Контейнер для тостов -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToastInstallApp" class="toast bg-theme-1" data-bs-delay="20000" role="alert" aria-live="assertive"
            aria-atomic="true">
            <div class="toast-header bg-theme-1">
                <img src="/assets/img/favicon.png" class="rounded me-2" alt="..." />
                <strong class="me-auto">Установить приложение?</strong>
                <!-- <small>10 sec ago</small> -->
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                <button type="button" class="btn btn-outline-info" @click="btnInstallAppClick">
                    <i class="bi bi-gender-male"></i>
                    Установить на домашний экран
                </button>
            </div>
        </div>

        <div id="toast" class="toast" data-bs-delay="1500" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <img src="/assets/img/favicon.png" class="rounded me-2" alt="..." />
                <strong class="me-auto">Adminuiux</strong>
                <!-- <small>10 sec ago</small> -->
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Hello, Beautiful world! This is a toast message ❤️.
            </div>
        </div>
    </div>
</template>

<style scoped>
.app-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
}

.loader-container {
    text-align: center;
    color: white;
}

.loader-container h4 {
    color: white;
    font-weight: 600;
}

.loader-container .text-muted {
    color: rgba(255, 255, 255, 0.8) !important;
}

.loader-container .spinner-border {
    border-color: rgba(255, 255, 255, 0.3);
    border-right-color: white;
}
</style>
