<script setup lang="ts">
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <div class="container pt-4 mt-3" id="main-content">
            <div class="row mb-4">
                <div class="col-12">
                    <h4 class="mb-0">Добро пожаловать!</h4>
                    <p class="text-muted">Управляйте своими сервисами и услугами</p>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-6 mb-3">
                    <div class="card adminuiux-card">
                        <div class="card-body">
                            <h6 class="mb-3">
                                <i class="bi bi-wallet2 me-2"></i>Кошелек
                            </h6>
                            <p class="text-secondary mb-3">
                                Управляйте балансом, пополняйте счет и выводите средства
                            </p>
                            <RouterLink to="/wallet" class="btn btn-outline-primary">
                                <i class="bi bi-wallet2 me-2"></i>Открыть кошелек
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 mb-3">
                    <div class="card adminuiux-card">
                        <div class="card-body">
                            <h6 class="mb-3">
                                <i class="bi bi-shop me-2"></i>Магазин
                            </h6>
                            <p class="text-secondary mb-3">
                                Покупайте товары и услуги за внутреннюю валюту
                            </p>
                            <RouterLink to="/shop" class="btn btn-outline-primary">
                                <i class="bi bi-cart me-2"></i>Перейти в магазин
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 mb-3">
                    <div class="card adminuiux-card">
                        <div class="card-body">
                            <h6 class="mb-3">
                                <i class="bi bi-diagram-3 me-2"></i>Реферальная программа
                            </h6>
                            <p class="text-secondary mb-3">
                                Приглашайте друзей и зарабатывайте на рефералах
                            </p>
                            <RouterLink to="/referral" class="btn btn-outline-primary">
                                <i class="bi bi-diagram-3 me-2"></i>Открыть реферальную программу
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 mb-3">
                    <div class="card bg-warning-subtle">
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
        </div>
    </main>
</template>

<style></style>
