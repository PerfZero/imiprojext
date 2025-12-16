<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();
const { signOut } = authClient;
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <!-- Content  -->
        <h1>Landing Page</h1>

        <div v-if="session.data">
            <RouterLink to="/dashboard" class="btn btn-sm btn-outline-info">
                <i class="bi bi-card-text"></i> Перейти в Личный кабинет
            </RouterLink>
            <button @click="signOut" class="btn btn-sm btn-outline-info">
                <i class="bi bi-box-arrow-right"></i> Выйти из аккаунта
            </button>
        </div>
        <div v-else>
            <RouterLink to="/login" class="btn btn-sm btn-outline-info">
                <i class="bi bi-person-circle"></i> Войти
            </RouterLink>
            <RouterLink to="/signup" class="btn btn-sm btn-outline-info">
                <i class="bi bi-person-circle"></i> Регистрация
            </RouterLink>
        </div>
    </main>
</template>

<style></style>
