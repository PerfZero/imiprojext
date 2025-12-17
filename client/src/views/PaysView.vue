<script setup>
import { ref } from "vue";
import apiService from "@/services/apiService";

import { formatTimestamp } from "@/utils/formatDateTime";

import { useNotifications } from "@/composables/useNotifications";
const { onNotify } = useNotifications();

const data = ref([]);
const update = async () => {
    data.value = await apiService.getTransactions();
};

update();

onNotify((data) => {
    if (data.notification?.category == "wallet") {
        update();
    }
});

const typeToName = (type) => {
    let name = "bi-currency-dollar";
    switch (type) {
        case "mlm_reward":
            name = "Награда за продажи рефераллов";
            break;
        case "deposit":
            name = "Пополнение счета";
            break;
        case "purchase":
            name = "Покупка в магазине";
            break;
        case "withdraw":
            name = "Вывод средств";
            break;
        case "convert_in":
            name = "Пополнение при конвертации";
            break;
        case "convert_out":
            name = "Списание при конвертации";
            break;
    }
    return name;
};

const typeToIcon = (type) => {
    let icon = "bi-currency-dollar";
    switch (type) {
        case "mlm_reward":
            icon = "bi-currency-dollar";
            break;
        case "deposit":
            icon = "bi-arrow-up-right";
            break;
        case "purchase":
            icon = "bi-bag";
            break;
        case "withdraw":
            icon = "bi-arrow-down-left";
            break;

        case "convert_in":
            icon = "bi-arrow-up-right";
            break;
        case "convert_out":
            icon = "bi-arrow-down-left";
            break;
    }
    return icon;
};
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <!-- page title -->
        <div class="container-fluid py-3">
            <div class="row gx-3 align-items-center page-title">
                <div class="col">
                    <h5 class="mb-0">История платежей</h5>
                    <p class="text-secondary small">Траты и поступления</p>
                </div>
                <div class="col-auto">
                    <button class="btn btn-link btn-square" data-bs-toggle="offcanvas" data-bs-target="#filter"
                        data-bs-placement="end">
                        <i class="bi bi-filter"></i>
                    </button>
                </div>
            </div>
            <nav aria-label="breadcrumb" class="breadcrumb-theme mt-3 rounded d-none d-lg-block">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item bi">
                        <RouterLink to="/dashboard"><i class="bi bi-house-door me-2"></i> Главная</RouterLink>
                    </li>
                    <li class="breadcrumb-item bi">
                        <RouterLink to="/pays"> Кошелек</RouterLink>
                    </li>
                    <li class="breadcrumb-item bi active" aria-current="page">
                        История
                    </li>
                </ol>
            </nav>
        </div>
        <!-- Content  -->
        <div class="container mt-3" id="main-content">
            <!-- recent transaction list -->
            <div class="row">
                <div class="col-12 px-0">
                    <div class="list-group list-group-flush border-top border-bottom bg-none mb-3 mb-lg-4">
                        <a v-for="item in data" class="list-group-item">
                            <div class="row gx-3 align-items-center">
                                <div class="col-auto">
                                    <div class="avatar avatar-40 rounded-circle border">
                                        <i class="bi h5" :class="typeToIcon(item.type)"></i>
                                    </div>
                                </div>
                                <div class="col">
                                    <p class="mb-1 fw-medium">
                                        {{ item.type }}
                                        {{ typeToName(item.type) }}
                                    </p>
                                    <p class="text-secondary small">
                                        {{ formatTimestamp(item.createdAt) }}
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <h6>
                                        {{ item.amount }} {{ item.currency }}
                                    </h6>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
