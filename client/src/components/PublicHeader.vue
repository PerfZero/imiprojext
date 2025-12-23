<template>
    <header class="public-header">
        <nav class="navbar navbar-expand-lg navbar-dark bg-black">
            <div class="container">
                <RouterLink to="/" class="navbar-brand">
                    <h3 class="mb-0 fw-bold">IMI <span class="text-white-50">CLUB</span></h3>
                </RouterLink>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <RouterLink to="/" class="nav-link" active-class="active">Главная</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/about" class="nav-link" active-class="active">О нас</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/partners" class="nav-link" active-class="active">Партнерам</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/login" class="nav-link">Войти</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/signup" class="nav-link btn btn-outline-light btn-sm ms-2">Регистрация</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.public-header {
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-brand {
    text-decoration: none;
    color: white !important;
}

.nav-link {
    color: rgba(255, 255, 255, 0.8) !important;
    font-weight: 500;
    transition: color 0.3s;
    padding: 0.5rem 1rem !important;
}

.nav-link:hover,
.nav-link.active {
    color: white !important;
}

.btn-outline-light {
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
}

.btn-outline-light:hover {
    background-color: white;
    color: black;
    border-color: white;
}
</style>

