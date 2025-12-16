<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

onMounted(() => {
    document.addEventListener("DOMContentLoaded", function () {
        // Get the dropdown toggle element by its ID or a suitable selector
        const dropdownToggle = document.getElementById("yourDropdownToggleId");
        // Trigger a click event on the dropdown toggle
        if (dropdownToggle) {
            //dropdownToggle.click();
            // Alternatively, for Bootstrap 4 and earlier:
            // $(dropdownToggle).dropdown('toggle');
        }
    });
});
</script>

<template>
    <!-- application list dropdown -->
    <div class="dropdown d-inline-block open">
        <button class="btn btn-link btn-square btn-icon btn-link-header dropdown-toggle no-caret" type="button"
            data-bs-toggle="dropdown" aria-expanded="false" id="yourDropdownToggleId">
            <i data-feather="grid"></i>
        </button>
        <!-- <div class="dropdown-menu dropdown-menu-end width-300 pt-0 px-0 overflow-hidden m-auto"> -->
        <div class="dropdown-menu dropdown-menu-end center-on-screen-mobile width-360 overflow-hidden"
            data-bs-popper-config='{"strategy":"fixed"}'>
            <div class="p-3 rounded mb-2">
                <h5 class="mb-0">Проекты IMI</h5>
                <p class="text-secondary small">Делают жизнь проще</p>
            </div>
            <div class="px-2">
                <div class="row gx-2 text-center mb-2">
                    <div class="col-4">
                        <RouterLink to="/cashback" class="dropdown-item square-item position-relative text-wrap"
                            href="template-finance-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-currency-dollar fs-5 mx-0" style="color: rgb(217 176 92)"></i>
                            </div>
                            <!-- <p class="mb-0">Кэшбэк-сервис</p> -->
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(217 176 92)">
                                Кэшбэк-сервис
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Деньги</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/learn" class="dropdown-item square-item position-relative text-wrap"
                            href="template-network-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-bank fs-5 mx-0" style="color: rgb(137 15 102)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(137 15 102)">
                                Корпоративный университет
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Знания</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/market" class="dropdown-item square-item position-relative text-wrap"
                            href="template-inventory-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-shop fs-5 mx-0" style="color: rgb(143 15 45)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(143 15 45)">
                                Sell Market
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Магазин</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/austore" class="dropdown-item square-item position-relative text-wrap"
                            href="template-project-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-box fs-5 mx-0" style="color: rgb(50 55 60)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(50 55 60)">
                                AU Store
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Management</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/wulet" class="dropdown-item square-item position-relative text-wrap"
                            href="template-social-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-wallet2 fs-5 mx-0" style="color: rgb(31 97 166)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(31 97 166)">
                                Wulet
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Tracking</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/tour" class="dropdown-item square-item position-relative text-wrap"
                            href="template-learning-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-airplane fs-5 mx-0" style="color: rgb(11 161 225)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(11 161 225)">
                                Туристичская программа
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Make-easy</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/bots" class="dropdown-item square-item position-relative text-wrap"
                            href="template-learning-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-robot fs-5 mx-0" style="color: rgb(1 0 7)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(1 0 7)">
                                Торговые боты
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Make-easy</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/mobile" class="dropdown-item square-item position-relative text-wrap"
                            href="template-learning-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-phone fs-5 mx-0" style="color: rgb(5 135 143)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(5 135 143)">
                                Мобильная связь
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Make-easy</p> -->
                        </RouterLink>
                    </div>
                    <div class="col-4">
                        <RouterLink to="/aunit" class="dropdown-item square-item position-relative text-wrap"
                            href="template-learning-dashboard.html">
                            <div class="avatar avatar-40 rounded my-2">
                                <i class="bi bi-journal-bookmark fs-5 mx-0" style="color: rgb(250 173 24)"></i>
                            </div>
                            <p class="mb-0 fs-12 fw-bolder" style="color: rgb(250 173 24)">
                                Aunit
                            </p>
                            <!-- <p class="fs-12 opacity-50 mb-2">Make-easy</p> -->
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <a class="btn btn-link text-center" href="/">Все сервисы
                    <i class="bi bi-arrow-right fs-14"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<style>
/* Применяем стили только для экранов шириной МЕНЕЕ 768px */
@media (max-width: 767.98px) {
    .center-on-screen-mobile {
        /* 1. Позиционирование относительно области просмотра */
        position: fixed !important;

        /* 2. Перемещаем верхний левый угол в центр экрана */
        top: 50% !important;
        left: 50% !important;

        /* 3. Смещаем сам элемент на половину его ширины и высоты назад */
        transform: translate(-50%, -50%) !important;

        /* 4. Убираем стандартные отступы */
        margin: 0 !important;
        margin-top: 20px !important;
        /* Дополнительно: можно задать максимальную ширину для мобильных */
        max-width: 90vw;
        /* Например, 90% ширины области просмотра */
    }
}
</style>
