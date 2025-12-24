<script setup>
import { ref, onMounted } from "vue";
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();
const { signOut } = authClient;

import NavbarApplicationsList from "@/components/NavbarApplicationsList.vue";
import Notifications from "@/components/Notifications.vue";

const searchOpen = ref(false);

const openSearch = () => {
    searchOpen.value = true;
    setTimeout(() => {
        const searchInput = document.querySelector('.adminuiux-search-full input');
        if (searchInput) {
            searchInput.focus();
        }
    }, 100);
};

const closeSearch = () => {
    searchOpen.value = false;
};

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.openSearch = openSearch;
        window.closeSearch = closeSearch;
    }
});
</script>

<template>
    <header class="adminuiux-header inner-page">
        <nav class="navbar fixed-top">
            <div class="container-fluid">
                <button class="btn btn-link btn-square sidebar-toggler ms-1" type="button" onclick="initSidebar()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu sidebar-svg">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <RouterLink to="/dashboard" class="navbar-brand">
                    <div class="d-block ps-2">
                        <span class="h5">IMI <span class="fw-bold">CLUB</span></span>
                        <p class="company-tagline">Делаем жизнь лучше</p>
                    </div>
                </RouterLink>

                <div class="ms-auto">
                    <button class="btn btn-link btn-square btn-icon btn-link-header" type="button" @click="openSearch">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>

                    

                    <NavbarApplicationsList />

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
                                <div v-if="session.data?.user?.role === 'admin'">
                                    <RouterLink to="/admin" class="dropdown-item">
                                        <i class="bi bi-shield-check avatar avatar-18 me-1"></i>
                                        Админ панель
                                    </RouterLink>
                                </div>
                                <div>
                                    <RouterLink to="/profile" class="dropdown-item">
                                        <i class="bi bi-person avatar avatar-18 me-1"></i>
                                        Мой профиль
                                    </RouterLink>
                                </div>
                                <div>
                                    <RouterLink to="/dashboard" class="dropdown-item">
                                        <div class="row g-0">
                                            <div class="col align-self-center">
                                                <i class="bi bi-diagram-3 avatar avatar-18 me-1"></i>
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
                                    <RouterLink to="/referral" class="dropdown-item">
                                        <i class="bi bi-currency-dollar avatar avatar-18 me-1"></i>
                                        Заработок
                                    </RouterLink>
                                </div>

                                <div>
                                    <RouterLink to="/profile-settings" class="dropdown-item">
                                        <i class="bi bi-gear avatar avatar-18 me-1"></i>
                                        Настройки
                                    </RouterLink>
                                </div>
                                <div>
                                    <a class="dropdown-item theme-red" href="/" @click="signOut">
                                        <i class="bi bi-box-arrow-right avatar avatar-18 me-1"></i>
                                        Выйти
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="adminuiux-search-full" :class="{ 'show': searchOpen }">
            <div class="row gx-2 align-items-center">
                <div class="col-auto">
                    <button class="btn btn-link btn-square" type="button" @click="closeSearch">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                </div>
                <div class="col">
                    <input class="form-control pe-0 border-0" type="search" placeholder="Введите запрос для поиска...">
                </div>
                <div class="col-auto">
                    <div class="dropdown input-group-text border-0 p-0">
                        <button class="dropdown-toggle btn btn-link btn-square no-caret" type="button" id="searchfilter" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sliders">
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                            </svg>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end dropdown-dontclose width-300">
                            <ul class="nav adminuiux-nav" id="searchtab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="searchall-tab" data-bs-toggle="tab" data-bs-target="#searchall" type="button" role="tab">Все</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="searchproducts-tab" data-bs-toggle="tab" data-bs-target="#searchproducts" type="button" role="tab">Товары</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="searchusers-tab" data-bs-toggle="tab" data-bs-target="#searchusers" type="button" role="tab">Пользователи</button>
                                </li>
                            </ul>
                            <div class="tab-content py-3" id="searchtabContent">
                                <div class="tab-pane fade active show" id="searchall" role="tabpanel">
                                    <ul class="list-group adminuiux-list-group list-group-flush bg-none">
                                        <li class="list-group-item">
                                            <div class="row gx-3">
                                                <div class="col">Поиск по приложениям</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" role="switch" id="searchswitch1">
                                                        <label class="form-check-label" for="searchswitch1"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row gx-3">
                                                <div class="col">Включать страницы</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" role="switch" id="searchswitch2" checked>
                                                        <label class="form-check-label" for="searchswitch2"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="tab-pane fade" id="searchproducts" role="tabpanel">
                                    <ul class="list-group adminuiux-list-group list-group-flush bg-none">
                                        <li class="list-group-item">
                                            <div class="row gx-3">
                                                <div class="col">Активные товары</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" role="switch" id="searchswitch3" checked>
                                                        <label class="form-check-label" for="searchswitch3"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="tab-pane fade" id="searchusers" role="tabpanel">
                                    <ul class="list-group adminuiux-list-group list-group-flush bg-none">
                                        <li class="list-group-item">
                                            <div class="row gx-3">
                                                <div class="col">С email</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input" type="checkbox" role="switch" id="searchswitch4">
                                                        <label class="form-check-label" for="searchswitch4"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="px-2 pb-2">
                                <div class="row gx-3">
                                    <div class="col">
                                        <button class="btn btn-sm btn-theme">Применить</button>
                                    </div>
                                    <div class="col-auto">
                                        <button class="btn btn-sm btn-link theme-red" @click="closeSearch">Отмена</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
.adminuiux-search-full {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 1050;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
}

.adminuiux-search-full.show {
    transform: translateY(0);
}
</style>
