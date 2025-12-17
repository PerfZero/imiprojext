<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(true);

const menuItems = [
    { path: "/admin", icon: "bi-speedometer2", label: "Дашборд" },
    { path: "/admin/users", icon: "bi-people", label: "Пользователи" },
    { path: "/admin/transactions", icon: "bi-arrow-left-right", label: "Транзакции" },
    { path: "/admin/wallets", icon: "bi-wallet2", label: "Кошельки" },
    { path: "/admin/notifications", icon: "bi-bell", label: "Уведомления" },
];

const isActive = (path) => {
    if (path === "/admin") {
        return route.path === "/admin";
    }
    return route.path.startsWith(path);
};

const goBack = () => {
    router.push("/dashboard");
};
</script>

<template>
    <div class="admin-layout d-flex">
        <aside class="admin-sidebar bg-dark text-white" :class="{ collapsed: !sidebarOpen }">
            <div class="sidebar-header p-3 border-bottom border-secondary">
                <div class="d-flex align-items-center justify-content-between">
                    <h5 class="mb-0" v-if="sidebarOpen">
                        <i class="bi bi-shield-lock me-2"></i>Админ
                    </h5>
                    <button class="btn btn-sm btn-outline-light" @click="sidebarOpen = !sidebarOpen">
                        <i :class="sidebarOpen ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"></i>
                    </button>
                </div>
            </div>
            <nav class="sidebar-nav p-2">
                <router-link
                    v-for="item in menuItems"
                    :key="item.path"
                    :to="item.path"
                    class="nav-link d-flex align-items-center p-2 rounded mb-1"
                    :class="{ active: isActive(item.path) }"
                >
                    <i :class="item.icon" class="fs-5"></i>
                    <span v-if="sidebarOpen" class="ms-2">{{ item.label }}</span>
                </router-link>
                <hr class="border-secondary my-3" />
                <button class="nav-link d-flex align-items-center p-2 rounded w-100 text-start" @click="goBack">
                    <i class="bi bi-arrow-left fs-5"></i>
                    <span v-if="sidebarOpen" class="ms-2">Назад</span>
                </button>
            </nav>
        </aside>
        <main class="admin-content flex-grow-1 bg-light">
            <div class="p-4">
                <slot />
            </div>
        </main>
    </div>
</template>

<style scoped>
.admin-layout {
    min-height: 100vh;
}

.admin-sidebar {
    width: 250px;
    transition: width 0.3s ease;
}

.admin-sidebar.collapsed {
    width: 60px;
}

.admin-sidebar .nav-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.2s;
}

.admin-sidebar .nav-link:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
}

.admin-sidebar .nav-link.active {
    color: #fff;
    background: var(--bs-primary);
}

.admin-content {
    overflow-y: auto;
    max-height: 100vh;
}
</style>

