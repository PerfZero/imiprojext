<template>
    <div class="public-page">
        <PublicHeader />
        <main>
            <section class="hero-section bg-black text-white py-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mx-auto text-center">
                            <div class="hero-image mb-4">
                                <img src="https://via.placeholder.com/800x400/000000/FFFFFF?text=iMi+платформа" alt="iMi платформа" class="img-fluid rounded">
                            </div>
                            <h1 class="display-3 fw-bold mb-4">Познакомьтесь с iMi платформой</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section class="intro-section bg-white py-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-10 mx-auto">
                            <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body p-4">
                                    <p class="mb-3">
                                        iMi — это инновационная экосистема, созданная командой профессионалов, объединённых общей целью - сделать жизнь более комфортной и гармоничной. Наши эксперты разрабатывают передовые решения, сочетая опыт, креативность и современные технологии, чтобы предложить пользователям лучшие продукты и сервисы.
                                    </p>
                                    <p class="mb-0">
                                        Мы создаем пространство, где технологии работают на благо человека, упрощая повседневные задачи и открывая новые возможности. Платформа Мі объединяет передовые разработки и выгодные партнерские программы, предлагая пользователям удобные инструменты для роста, развития и улучшения качества жизни.
                                    </p>
                                </div>
                            </div>
                            <div class="intro-image mb-4 text-center">
                                <img src="https://via.placeholder.com/800x300/FFFFFF/000000?text=Присоединиться" alt="Присоединиться" class="img-fluid rounded shadow">
                            </div>
                            <div class="text-center">
                                <RouterLink to="/signup" class="btn btn-black btn-lg">
                                    <i class="bi bi-person-plus me-2"></i>Присоединиться
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mission-section bg-light py-5">
                <div class="container">
                    <h2 class="display-5 fw-bold text-center mb-5">Наша миссия</h2>
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="mission-image mb-3">
                                        <img src="https://via.placeholder.com/400x200/FFFFFF/000000?text=Технологии" alt="Технологии во благо человека" class="img-fluid rounded">
                                    </div>
                                    <h4 class="fw-bold mb-3">Технологии во благо человека</h4>
                                    <p class="text-muted">
                                        Мы создаем инновационную экосистему, где технологии, сервисы и партнерские решения работают на благо человека. Наша цель - сделать жизнь удобнее, гармоничнее и продуктивнее, предлагая пользователям передовые инструменты для развития, взаимодействия и достижения поставленных целей.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="mission-image mb-3">
                                        <img src="https://via.placeholder.com/400x200/FFFFFF/000000?text=Возможности" alt="Пространство новых возможностей" class="img-fluid rounded">
                                    </div>
                                    <h4 class="fw-bold mb-3">Пространство новых возможностей</h4>
                                    <p class="text-muted">
                                        Мы стремимся к тому, чтобы іМі стал не просто платформой, а пространством новых возможностей, где каждый человек может раскрыть свой потенциал, получить доступ к качественным продуктам и сервисам, а также стать частью динамичного и прогрессивного сообщества.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mission-cta-image text-center mt-4 mb-4">
                        <img src="https://via.placeholder.com/800x250/FFFFFF/000000?text=Присоединиться" alt="Присоединиться" class="img-fluid rounded shadow">
                    </div>
                    <div class="text-center mt-5">
                        <RouterLink to="/signup" class="btn btn-black btn-lg">
                            <i class="bi bi-person-plus me-2"></i>Присоединиться
                        </RouterLink>
                    </div>
                </div>
            </section>

            <section class="values-section bg-white py-5">
                <div class="container">
                    <h2 class="display-5 fw-bold text-center mb-5">Наши ценности</h2>
                    <div class="swiper values-swiper mb-4">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body p-4 text-center">
                                        <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                            <i class="bi bi-lightbulb fs-3"></i>
                                        </div>
                                        <h5 class="fw-bold mb-2">Инновации</h5>
                                        <p class="text-muted small mb-0">
                                            Мы внедряем передовые технологии, создавая удобные и эффективные решения для пользователей.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body p-4 text-center">
                                        <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                            <i class="bi bi-star fs-3"></i>
                                        </div>
                                        <h5 class="fw-bold mb-2">Качество</h5>
                                        <p class="text-muted small mb-0">
                                            Стремимся к высокому уровню сервисов и продуктов, гарантируя надежность и комфорт.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body p-4 text-center">
                                        <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                            <i class="bi bi-eye fs-3"></i>
                                        </div>
                                        <h5 class="fw-bold mb-2">Прозрачность</h5>
                                        <p class="text-muted small mb-0">
                                            Строим доверительные отношения, придерживаясь честности и открытости в работе.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body p-4 text-center">
                                        <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                            <i class="bi bi-people fs-3"></i>
                                        </div>
                                        <h5 class="fw-bold mb-2">Сообщество</h5>
                                        <p class="text-muted small mb-0">
                                            Создаем экосистему, где каждый может расти, развиваться и взаимодействовать.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body p-4 text-center">
                                        <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                            <i class="bi bi-shield-check fs-3"></i>
                                        </div>
                                        <h5 class="fw-bold mb-2">Ответственность</h5>
                                        <p class="text-muted small mb-0">
                                            Ориентируемся на устойчивое развитие и заботимся о будущем поколении.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body p-4 text-center">
                                        <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                            <i class="bi bi-heart fs-3"></i>
                                        </div>
                                        <h5 class="fw-bold mb-2">Гармония</h5>
                                        <p class="text-muted small mb-0">
                                            Балансируем технологии и человеческие ценности, делая жизнь удобнее и осознаннее.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body p-4 text-center">
                                        <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                            <i class="bi bi-gem fs-3"></i>
                                        </div>
                                        <h5 class="fw-bold mb-2">Привилегии</h5>
                                        <p class="text-muted small mb-0">
                                            Предоставляем пользователям уникальные возможности и выгодные условия для роста и развития.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
            </section>

            <section class="conclusion-section bg-black text-white py-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-10 mx-auto text-center">
                            <h2 class="display-5 fw-bold mb-4">IMI Club</h2>
                            <p class="lead mb-4">
                                Инновационная социальная платформа, которая объединяет нелинейный, социальные и технологические аспекты для создания экосистемы ориентированной на улучшение жизни человека.
                            </p>
                            <p class="h4 fw-bold mb-0">"Вы ждали - Мы Сделали"</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="cta-section bg-white py-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mx-auto text-center">
                            <h2 class="display-5 fw-bold mb-4">Присоединяйтесь к нам</h2>
                            <p class="lead mb-4">Станьте частью инновационной экосистемы IMI Club</p>
                            <div class="d-flex flex-wrap gap-3 justify-content-center">
                                <RouterLink to="/signup" class="btn btn-black btn-lg">
                                    <i class="bi bi-person-plus me-2"></i>Зарегистрироваться
                                </RouterLink>
                                <RouterLink to="/partners" class="btn btn-outline-dark btn-lg">
                                    <i class="bi bi-handshake me-2"></i>Стать партнером
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <PublicFooter />
    </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import PublicHeader from '@/components/PublicHeader.vue';
import PublicFooter from '@/components/PublicFooter.vue';

declare global {
    interface Window {
        Swiper: any;
    }
}

onMounted(() => {
    nextTick(() => {
        if (window.Swiper) {
            const valuesSwiper = document.querySelector('.values-swiper');
            if (valuesSwiper) {
                new window.Swiper(valuesSwiper, {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    breakpoints: {
                        576: {
                            slidesPerView: 2,
                        },
                        768: {
                            slidesPerView: 3,
                        },
                        992: {
                            slidesPerView: 4,
                        },
                    },
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    loop: true,
                });
            }
        }
    });
});
</script>

<style scoped>
.public-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.public-page main {
    flex: 1;
}

.values-swiper {
    padding-bottom: 40px;
}

.swiper-pagination {
    position: relative;
    margin-top: 20px;
}

.swiper-pagination-bullet {
    background: black;
    opacity: 0.5;
}

.swiper-pagination-bullet-active {
    opacity: 1;
}

.btn-black {
    background-color: black;
    color: white;
    border-color: black;
}

.btn-black:hover {
    background-color: #333;
    border-color: #333;
    color: white;
}

.hero-image img,
.intro-image img,
.mission-image img,
.mission-cta-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.hero-image img {
    max-height: 400px;
}

.intro-image img {
    max-height: 300px;
}

.mission-image img {
    max-height: 200px;
}

.mission-cta-image img {
    max-height: 250px;
}
</style>
