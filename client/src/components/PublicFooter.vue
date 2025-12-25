<template>
    <footer class="public-footer bg-black text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4 mb-md-0">
                    <h5 class="fw-bold mb-3">IMI CLUB</h5>
                    <p class="text-white-50 small">
                        Инновационная социальная платформа, которая объединяет коммерческие, социальные и технологические аспекты сервисов для создания экосистемы.
                    </p>
                </div>
                <div class="col-md-4 mb-4 mb-md-0">
                    <h6 class="fw-bold mb-3">Навигация</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2">
                            <RouterLink to="/" class="text-white-50 text-decoration-none">Главная</RouterLink>
                        </li>
                        <li class="mb-2">
                            <RouterLink to="/about" class="text-white-50 text-decoration-none">О нас</RouterLink>
                        </li>
                        <li class="mb-2">
                            <RouterLink to="/partners" class="text-white-50 text-decoration-none">Партнерам</RouterLink>
                        </li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h6 class="fw-bold mb-3">Контакты</h6>
                    <ul class="list-unstyled text-white-50 small">
                        <li class="mb-2">
                            <i class="bi bi-envelope me-2"></i>info@imiclub.com
                        </li>
                        <li class="mb-2">
                            <i class="bi bi-telephone me-2"></i>+7 (XXX) XXX-XX-XX
                        </li>
                    </ul>
                </div>
            </div>
            <hr class="my-4 border-secondary">
            <div class="row">
                <div class="col-md-6">
                    <p class="text-white-50 small mb-0">
                        &copy; {{ new Date().getFullYear() }} IMI CLUB. Все права защищены.
                    </p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="text-white-50 small mb-0">
                        "Вы ждали - Мы Сделали"
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.public-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.public-footer a:hover {
    color: white !important;
}
</style>





