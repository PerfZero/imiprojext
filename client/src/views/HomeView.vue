<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();
const { signOut } = authClient;
</script>

<template>
    <main class="adminuiux-content">
        <div class="container-fluid">
            <div class="row justify-content-center minheight-dynamic" style="
                    --mih-dynamic: calc(
                        100vh - 145px - env(safe-area-inset-bottom) -
                            env(safe-area-inset-top)
                    );
                ">
                <div class="col-12 col-lg-10">
                    <div class="h-100 py-5 px-md-4">
                        <div v-if="session.data" class="text-center">
                            <div class="mb-4">
                                <h1 class="display-4 fw-bold mb-3">Добро пожаловать в IMI CLUB!</h1>
                                <p class="lead text-muted mb-4">
                                    Ваш личный кабинет готов к использованию
                                </p>
                            </div>
                            <div class="d-flex gap-3 justify-content-center flex-wrap">
                                <RouterLink to="/dashboard" class="btn btn-lg btn-primary">
                                    <i class="bi bi-speedometer2 me-2"></i>Перейти в Личный кабинет
                                </RouterLink>
                                <button @click="signOut" class="btn btn-lg btn-outline-secondary">
                                    <i class="bi bi-box-arrow-right me-2"></i>Выйти
                                </button>
                            </div>
                        </div>
                        <div v-else class="row align-items-center h-100">
                            <div class="col-12 col-md-6 mb-4 mb-md-0">
                                <h1 class="display-3 fw-bold mb-4">IMI CLUB</h1>
                                <p class="lead mb-4">
                                    Ваш клуб для покупок и заработка. Присоединяйтесь к сообществу и начните зарабатывать уже сегодня!
                                </p>
                                <div class="d-flex flex-column flex-sm-row gap-3">
                                    <RouterLink to="/signup" class="btn btn-lg btn-primary">
                                        <i class="bi bi-person-plus me-2"></i>Начать сейчас
                                    </RouterLink>
                                    <RouterLink to="/login" class="btn btn-lg btn-outline-primary">
                                        <i class="bi bi-box-arrow-in-right me-2"></i>Войти
                                    </RouterLink>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="card adminuiux-card text-center p-4">
                                            <div class="avatar avatar-60 rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-3">
                                                <i class="bi bi-wallet2 fs-2"></i>
                                            </div>
                                            <h6>Кошелек</h6>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="card adminuiux-card text-center p-4">
                                            <div class="avatar avatar-60 rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-3">
                                                <i class="bi bi-shop fs-2"></i>
                                            </div>
                                            <h6>Магазин</h6>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="card adminuiux-card text-center p-4">
                                            <div class="avatar avatar-60 rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center mx-auto mb-3">
                                                <i class="bi bi-diagram-3 fs-2"></i>
                                            </div>
                                            <h6>Рефералы</h6>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="card adminuiux-card text-center p-4">
                                            <div class="avatar avatar-60 rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center mx-auto mb-3">
                                                <i class="bi bi-graph-up fs-2"></i>
                                            </div>
                                            <h6>Заработок</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.minheight-dynamic {
    min-height: var(--mih-dynamic, 100vh);
}
</style>
