<script setup lang="ts">
import { computed } from 'vue';
import IncomeByLevels from '@/components/IncomeByLevels.vue'
import MyReferrer from '@/components/MyReferrer.vue'
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();

// Вычисляемая переменная для реферальной ссылки
const referralLink = computed(() => {

    if (session.value?.data?.user?.referralCode) {
        // Получаем текущий URL сайта (схема + домен)
        const baseUrl = window.location.origin;
        // Формируем реферальную ссылку
        return `${baseUrl}/ref/${session.value.data.user.referralCode}`;
    }
    return '';
});

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
        // Web Share API не поддерживается
        console.log("Web Share API не поддерживается в этом браузере");
    }
};

const btnCopyToClipboardClick = async () => {
    try {
        await navigator.clipboard.writeText(referralLink.value);
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
}
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <!-- Content  -->
        <div class="container pt-4 mt-3" id="main-content">
            <div class="row">
                <!-- Ваша реф.ссылка -->
                <div class="col-12 mb-3">
                    <div class="card adminuiux-card">
                        <div class="card-body">
                            <div class="row gx-3">
                                <div class="col">
                                    <h5>Приглашайте друзей и зарабатывайте</h5>
                                    <p class="text-secondary small">
                                        Предложите другу присоединиться к нам и
                                        заработайте 10% от его первой прибыли.
                                    </p>

                                    <p class="text-secondary">
                                        Скопируйте и поделитесь своей
                                        реферальной ссылкой с вашей сетью
                                    </p>
                                    <div class="input-group">
                                        <input type="text" class="form-control border-theme-1"
                                            aria-describedby="button-addon2" v-model="referralLink" disabled="" />
                                        <button class="btn btn-outline-theme" type="button" id="button-addon2"
                                            @click="btnCopyToClipboardClick">
                                            <i class="bi bi-copy"></i>
                                        </button>
                                    </div>
                                    <button type="button" class="btn btn-outline-info mt-2" @click="btnShareClick">
                                        <i class="bi bi-share"></i>
                                        Поделиться ссылкой
                                    </button>
                                </div>
                                <div class="col-auto">
                                    <div class="avatar avatar-60 rounded bg-theme-1-subtle text-theme-1">
                                        <i class="bi bi-send h1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ваш реферрер -->
                <div class="col-12 col-md-6 mb-3">
                    <MyReferrer />
                </div>
                <!-- Школа новичка -->
                <div class="col-12 col-md-6 mb-3">
                    <div class="card bg-warning-subtle mb-3 mb-lg-4">
                        <div class="card-body">
                            <h6 class="mb-2">Школа новичка</h6>
                            <p class="text-secondary">
                                Проходите обучение по использованию сервиса IMI
                                и получайте первые деньги за прохождение.
                            </p>

                            <button class="btn btn-theme">
                                <i class="bi bi-qr-code"></i> Начать обучение
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- Второй и третий блоки: на мобильных — 100%, на md+ — по 6 колонок (50%) -->
                <div class="col-12 col-md-7 mb-3">
                    <div class="row">
                        <!-- Второй и третий блоки: на мобильных — 100%, на md+ — по 6 колонок (50%) -->
                        <div class="col-6 col-md-6 mb-3">
                            <div class="card border-0 overflow-hidden bg-theme-r-gradient text-white">
                                <div class="card-body">
                                    <div class="row gx-3 align-items-center">
                                        <div class="col">
                                            <div class="position-relative">
                                                <h3 class="mb-0">Новичок</h3>
                                                <p class="small">
                                                    Приведи 3 друзей и закрой 5
                                                    сделок
                                                </p>
                                                <button class="btn btn-sm btn-accent">
                                                    Ваш статус
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-4 position-relative"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-md-6 mb-3">
                            <div
                                class="card border-0 overflow-hidden bg-theme-accent-r-gradient text-white theme-orange">
                                <div class="card-body">
                                    <div class="row gx-3 align-items-center">
                                        <div class="col">
                                            <div class="position-relative">
                                                <h3 class="mb-0">PRO</h3>
                                                <p class="small">
                                                    Приведи 5 друзей и закрой 5
                                                    сделок
                                                </p>
                                                <button class="btn btn-sm btn-accent">
                                                    Будущий статус
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-4 position-relative"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <!-- Второй и третий блоки: на мобильных — 100%, на md+ — по 6 колонок (50%) -->
                        <div class="col-12 col-md-12 mb-3">
                            <IncomeByLevels />
                        </div>
                    </div>
                </div>
                <!-- Пример -->
                <div class="col-12 col-md-5 mb-3">
                    <div class="card adminuiux-card">
                        <div class="card-header">
                            <h6>Программа лояльности APlay</h6>
                        </div>
                        <div class="table-responsive">
                            <table class="table mb-0">
                                <tbody>
                                    <tr>
                                        <td class="text-start align-middle text-secondary fs-12">
                                            Личный объем(начисляется сразу)
                                            <i class="bi bi-info-circle ms-1" style="
                                                    font-size: 0.85em;
                                                    color: #0d6efd;
                                                "></i>
                                        </td>
                                        <td class="selected fs-12">10</td>
                                        <td class="">
                                            <i class="text-success bi bi-check-circle h5"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-start align-middle text-secondary fs-12">
                                            Количество партнеров первой линии,
                                            набравших более 300 баллов
                                        </td>
                                        <td class="selected fs-12">5</td>
                                        <td class="">
                                            <i class="text-success bi bi-check-circle h5"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-start align-middle text-secondary fs-12">
                                            Групповой объем(покупки структуры)
                                            <i class="bi bi-info-circle ms-1" style="
                                                    font-size: 0.85em;
                                                    color: #0d6efd;
                                                "></i>
                                        </td>
                                        <td class="selected fs-12">1500</td>
                                        <td class="">
                                            <i class="text-success bi bi-circle h5"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-start align-middle text-secondary fs-12">
                                            Групповой объем(ваш конвертируем
                                            объем)
                                            <i class="bi bi-info-circle ms-1" style="
                                                    font-size: 0.85em;
                                                    color: #0d6efd;
                                                "></i>
                                        </td>
                                        <td class="selected fs-12">300</td>
                                        <td class="">
                                            <i class="text-success bi bi-circle h5"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="p-2">
                                <p class="lead fw-bold fs-12">
                                    Личный объем всегда сохраняется! Для
                                    конвертации баллов вашего группового объема,
                                    в течении месяца необходимо выполнить одно
                                    из следующих условий:
                                </p>

                                <h5 class="mt-4 fs-12">Вариант 1:</h5>
                                <ul class="list-unstyled fs-12">
                                    <li class="mb-2">
                                        <strong>Пункт 1:</strong> Покупая себе,
                                        Вы набираете Личный объем. Необходимо
                                        набрать минимум 300 баллов личного
                                        объема.
                                    </li>
                                    <li class="mb-2">
                                        <strong>Пункт 2:</strong> Ваши 2 личные,
                                        должны сделать тоже самое, купить себе и
                                        набрать минимум по 300 баллов.
                                    </li>
                                    <li class="mb-2">
                                        <strong>Пункт 3:</strong> Общий
                                        групповой объем всей Вашей структуры
                                        должен составлять минимум 1000 баллов.
                                    </li>
                                </ul>

                                <h5 class="mt-4 fs-12">Вариант 2:</h5>
                                <ul class="list-unstyled fs-12">
                                    <li>
                                        <strong>Только 1 пункт:</strong>
                                        Необходимо набрать минимум 1000 баллов
                                        личного объема, тогда все остальные
                                        условия будут считаться выполненными
                                        автоматически.
                                    </li>
                                </ul>
                            </div>

                            <p class="fs-6 p-2 text-center">
                                На вашем счету APlay:
                                <b style="color: red">127 баллов</b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style></style>
