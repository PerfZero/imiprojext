<script setup>
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();
const { signOut } = authClient;

import NavbarApplicationsList from "@/components/NavbarApplicationsList.vue";
import Notifications from "@/components/Notifications.vue";


</script>

<template>
    <!-- standard header -->
    <header class="adminuiux-header inner-page">

        <!-- Fixed navbar -->
        <nav class="navbar">
            <div class="container-fluid">
                <!-- main sidebar toggle -->
                <button class="btn btn-link btn-square sidebar-toggler ms-1" type="button" onclick="initSidebar()"
                    id="sidebar-toggler">
                    <i class="sidebar-svg" data-feather="menu"></i>
                </button>
                <!-- logo -->

                <RouterLink to="/dashboard" class="navbar-brand">
                    <!-- <img data-bs-img="light" src="/assets/logo.png" alt="" /> -->
                    <!-- <img data-bs-img="dark" src="/assets/img/logo.svg" alt="" /> -->
                    <div class="d-block ps-2">
                        <span class="h5"><span class="fw-bold">IMI CLUB</span></span>
                        <p class="company-tagline">Делаем жизнь лучше</p>
                    </div>
                </RouterLink>
                <!-- right icons button -->
                <div class="ms-auto">
                    <!-- dark mode -->
                    <!-- <button
                        class="btn btn-link btn-square btnsunmoon btn-link-header"
                        id="btn-layout-modes-dark-page"
                    >
                        <i class="sun mx-auto" data-feather="sun"></i>
                        <i class="moon mx-auto" data-feather="moon"></i>
                    </button> -->

                    <!-- application list dropdown -->
                    <NavbarApplicationsList />

                    <!-- notification dropdown -->
                    <!-- <button
                        class="btn btn-link btn-square btn-icon btn-link-header dropdown-toggle position-relative no-caret"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#view-notification"
                        aria-expanded="false"
                    >
                        <i data-feather="bell"></i>
                        <span
                            class="position-absolute top-0 end-0 badge rounded-pill bg-danger p-1"
                        >
                            <small>9+</small>
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </button> -->

                    <!-- notification dropdown -->

                    <Notifications />

                    <!-- profile dropdown -->
                    <div class="dropdown d-inline-block">
                        <a class="dropdown-toggle btn btn-link btn-link-header style-none" id="userprofiledd"
                            data-bs-toggle="dropdown" aria-expanded="false" role="button" style="margin-top: -2px">
                            <div class="row gx-0 d-inline-flex">
                                <div class="col-auto align-self-center">
                                    <div class="avatar avatar-28 rounded-circle bg-theme-1 d-flex align-items-center justify-content-center">
                                        <i class="bi bi-person-fill text-white" style="font-size: 1rem; line-height: 1;"></i>
                                    </div>
                                </div>
                                <div class="col align-self-center d-none d-xl-block px-2">
                                    <!-- <span class="mb-0">Иван Иванов</span> -->
                                    <span v-if="session.data?.user.name == '-'" class="mb-0">{{ session.data?.user.email
                                        }}</span>
                                    <span v-else class="mb-0">{{ session.data?.user.name }}</span>
                                </div>
                            </div>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end width-300 pt-0 px-0"
                            aria-labelledby="userprofiledd">
                            <div class="bg-theme-1-space rounded py-3 mb-3 dropdown-dontclose">
                                <div class="row gx-0">
                                    <div class="col-auto px-3">
                                        <div class="avatar avatar-50 rounded-circle bg-theme-1 d-flex align-items-center justify-content-center">
                                            <i class="bi bi-person-fill text-white" style="font-size: 1.5rem; line-height: 1;"></i>
                                        </div>
                                    </div>
                                    <div class="col align-self-center">
                                        <p class="mb-1">

                                            <span v-if="session.data?.user.name == '-'">{{
                                                session.data?.user.email
                                                }}</span>
                                            <span v-else>{{ session.data?.user.name }}</span>
                                        </p>
                                        <p>
                                            <i class="bi bi-envelope me-2"></i>
                                            {{ session.data?.user.email }}
                                            <small class="opacity-50"></small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="px-2">
                                <div>
                                    <RouterLink to="/profile" class="dropdown-item"><i data-feather="user"
                                            class="avatar avatar-18 me-1"></i>
                                        Мой профиль</RouterLink>
                                </div>
                                <div>
                                    <RouterLink to="/dashboard" class="dropdown-item">
                                        <div class="row g-0">
                                            <div class="col align-self-center">
                                                <i data-feather="layout" class="avatar avatar-18 me-1"></i>
                                                Структура
                                            </div>
                                            <div class="col-auto">
                                                <figure class="avatar avatar-20 coverimg rounded-circle">
                                                    <img src="/assets/img/template/user-1.jpg" alt="" />
                                                </figure>
                                                <figure class="avatar avatar-20 coverimg rounded-circle">
                                                    <img src="/assets/img/template/user-2.jpg" alt="" />
                                                </figure>
                                                <figure class="avatar avatar-20 coverimg rounded-circle">
                                                    <img src="/assets/img/template/user-4.jpg" alt="" />
                                                </figure>
                                                <div
                                                    class="avatar avatar-20 bg-theme-1 rounded-circle text-center align-middle">
                                                    <small class="fs-10 align-middle">9+</small>
                                                </div>
                                            </div>
                                        </div>
                                    </RouterLink>
                                </div>
                                <div>
                                    <RouterLink to="/dashboard" class="dropdown-item">
                                        <i data-feather="dollar-sign" class="avatar avatar-18 me-1"></i>

                                        Заработок
                                    </RouterLink>
                                </div>

                                <div>
                                    <RouterLink to="/profile-settings" class="dropdown-item">
                                        <i data-feather="settings" class="avatar avatar-18 me-1"></i>
                                        Настройки
                                    </RouterLink>
                                </div>
                                <div>
                                    <a class="dropdown-item theme-red" href="/" @click="signOut">
                                        <i data-feather="power" class="avatar avatar-18 me-1"></i>
                                        Выйти
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>
