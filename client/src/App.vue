<script setup lang="ts">

import { RouterView } from "vue-router";
import AppLayout from "@/AppLayout.vue";
import "/assets/js/template/template-dashboard.js?url";
</script>

<template>
    <AppLayout>
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
