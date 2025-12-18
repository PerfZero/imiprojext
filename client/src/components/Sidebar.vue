<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();

import { useNotifications } from '@/composables/useNotifications';
const { onNotify } = useNotifications();

import Balance from "@/components/Balance.vue";


const route = useRoute();

onNotify((data) => {


})

watch(
    () => route.fullPath, // или route.path, route.params, route.query и т.д.
    (newPath, oldPath) => {
        const sidebar = document.getElementById("sidebar");
        const body = document.body;

        sidebar.classList.add("hidden");
        body.classList.remove("sidebar-open");


        const sidebarNavLinks = document.querySelectorAll(
            ".adminuiux-sidebar .adminuiux-sidebar-inner .nav .nav-item .nav-link",
        );
        sidebarNavLinks.forEach((link) => {
            if (!link.href) return;
            const url = new URL(link.href);
            const pathOnly = url.pathname;

            if (newPath === pathOnly) {
                link.classList.add("active");
                const dropdown = link.closest(".dropdown");
                if (dropdown) {
                    const dropdownMenu =
                        dropdown.querySelector(".dropdown-menu");
                    const dropdownToggle =
                        dropdown.querySelector(".dropdown-toggle");
                    if (dropdownMenu) dropdownMenu.classList.add("show");
                    if (dropdownToggle) dropdownToggle.classList.add("show");
                }
            }
        });
    },
);
</script>

<template>
    <div class="adminuiux-sidebar shadow-sm" id="sidebar" style="padding-top: 68px;">
        <div class="adminuiux-sidebar-inner">
            <!-- <div class="px-3 not-iconic mt-3">
                <div class="row gx-3 gx-lg-4">
                    <div class="col align-self-center menu-name">
                        <h6>Main navigation</h6>
                    </div>
                    <div class="col-auto">
                        <a
                            class="collapsed btn btn-link btn-square"
                            data-bs-toggle="collapse"
                            data-bs-target="#usersidebarprofile"
                            aria-expanded="false"
                            role="button"
                            aria-controls="usersidebarprofile"
                        >
                            <i class="bi bi-person-circle"></i>
                        </a>
                    </div>
                </div>
            </div> -->
            <!-- user information -->
            <RouterLink to="/profile" class="px-3 pt-4 not-iconic d-block text-decoration-none" id="usersidebarprofile">
                <div class="d-flex align-items-center">
                    <div class="flex-shrink-0 me-3">
                        <div class="avatar avatar-40 rounded shadow-sm bg-theme-1 d-flex align-items-center justify-content-center">
                            <i class="bi bi-person-fill text-white" style="font-size: 1.25rem; line-height: 1;"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1 text-start">
                        <h6 class="mb-1 text-white" id="usernamedisplay">{{ session.data?.user.name }}</h6>
                        <p class="text-white-50 small mb-0">{{ session.data?.user.email }}</p>
                    </div>
                </div>
            </RouterLink>
            <hr class="border-1 opacity-20" style="color: white; opacity: 0.1" />
            <!-- user menu navigation -->
            <ul class="nav flex-column menu-active-line">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle op" data-bs-toggle="dropdown" aria-expanded="false"
                        role="button">
                        <i class="menu-icon bi bi-cash-stack"></i>
                        <div class="col menu-name">Кошелек</div>
                    </a>
                    <ul class="dropdown-menu">
                        <Balance />

                        <!-- <li class="nav-item">
                            <RouterLink to="/wallet" class="nav-link">
                                <i class="menu-icon bi bi-wallet2 h4"></i>
                                <span class="menu-name">Кошелек</span>
                            </RouterLink>
                        </li> -->
                        <li class="nav-item">
                            <RouterLink to="/topup" class="nav-link">
                                <i class="menu-icon bi bi-plus-lg h4"></i>
                                <span class="menu-name">Пополнить баланс</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/convert" class="nav-link">
                                <i class="menu-icon bi bi-arrow-left-right h4"></i>
                                <span class="menu-name">Конвертировать</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/withdraw" class="nav-link">
                                <i class="menu-icon bi bi-arrow-down-left h4"></i>
                                <span class="menu-name">Вывести</span>
                            </RouterLink>
                        </li>


                        <!-- <li class="nav-item">
                            <RouterLink to="/pay" class="nav-link">
                                <i class="menu-icon bi bi-credit-card h4"></i>
                                <span class="menu-name">Оплатить услуги</span>
                            </RouterLink>
                        </li> -->

                        <li class="nav-item">
                            <RouterLink to="/pays" class="nav-link">
                                <i class="menu-icon bi bi-card-checklist h4"></i>
                                <span class="menu-name">Мои платежи</span>
                            </RouterLink>
                        </li>
                    </ul>


                </li>
            </ul>

            <ul class="nav flex-column menu-active-line">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle op" data-bs-toggle="dropdown" aria-expanded="false"
                        role="button">
                        <i class="menu-icon bi bi-shop"></i>
                        <div class="col menu-name">Магазин</div>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="nav-item">
                            <RouterLink to="/shop" class="nav-link">
                                <i class="menu-icon bi bi-cart h4"></i>
                                <span class="menu-name">Потратить деньги</span>
                            </RouterLink>
                        </li>
                    </ul>
                </li>
            </ul>

            <ul class="nav flex-column menu-active-line">
                <li class="nav-item">
                    <RouterLink to="/referral" class="nav-link">
                        <i class="menu-icon bi bi-diagram-3"></i>
                        <span class="menu-name">Реферальная программа</span>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>
