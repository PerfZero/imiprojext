<script setup lang="ts">
    </script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <div class="container pt-4 mt-3" id="main-content">
            <div class="row mb-4">
                <div class="col-12">
                    <h3 class="mb-2">Добро пожаловать!</h3>
                    <p class="text-muted mb-0">Управляйте своими сервисами и услугами</p>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-12 col-md-6 col-lg-4">
                    <RouterLink to="/wallet" class="text-decoration-none">
                        <div class="card adminuiux-card h-100 border-0 shadow-sm hover-lift">
                            <div class="card-body text-center p-4">
                                <div class="avatar avatar-60 rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-3">
                                    <i class="bi bi-wallet2 fs-2"></i>
                                </div>
                                <h5 class="mb-2">Кошелек</h5>
                                <p class="text-muted small mb-0">
                                    Управляйте балансом, пополняйте счет и выводите средства
                                </p>
                            </div>
                        </div>
                    </RouterLink>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <RouterLink to="/shop" class="text-decoration-none">
                        <div class="card adminuiux-card h-100 border-0 shadow-sm hover-lift">
                            <div class="card-body text-center p-4">
                                <div class="avatar avatar-60 rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-3">
                                    <i class="bi bi-shop fs-2"></i>
                                </div>
                                <h5 class="mb-2">Магазин</h5>
                                <p class="text-muted small mb-0">
                                    Покупайте товары и услуги за внутреннюю валюту
                                </p>
                            </div>
                        </div>
                    </RouterLink>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <RouterLink to="/referral" class="text-decoration-none">
                        <div class="card adminuiux-card h-100 border-0 shadow-sm hover-lift">
                            <div class="card-body text-center p-4">
                                <div class="avatar avatar-60 rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center mx-auto mb-3">
                                    <i class="bi bi-diagram-3 fs-2"></i>
                                </div>
                                <h5 class="mb-2">Реферальная программа</h5>
                                <p class="text-muted small mb-0">
                                    Приглашайте друзей и зарабатывайте на рефералах
                                </p>
                            </div>
                        </div>
                    </RouterLink>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card adminuiux-card h-100 border-0 shadow-sm bg-warning-subtle">
                        <div class="card-body text-center p-4">
                            <div class="avatar avatar-60 rounded-circle bg-warning text-white d-flex align-items-center justify-content-center mx-auto mb-3">
                                <i class="bi bi-book fs-2"></i>
                            </div>
                            <h5 class="mb-2">Школа новичка</h5>
                            <p class="text-muted small mb-3">
                                Проходите обучение по использованию сервиса IMI и получайте первые деньги
                            </p>
                            <button class="btn btn-warning">
                                <i class="bi bi-play-circle me-2"></i>Начать обучение
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}
</style>

<style></style>
