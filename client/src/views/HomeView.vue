<template>
    <div class="public-page">
        <PublicHeader />
        <main>
            <section class="hero-section bg-black text-white py-5">
                <div class="container">
                    <div class="row align-items-center min-vh-50">
                        <div class="col-lg-6">
                            <h1 class="display-3 fw-bold mb-4">IMI Club</h1>
                            <p class="lead mb-4">
                                Это социальный проект и комплекс надежных сервис инструментов в нашей цифровой вселенной
                            </p>
                            <p class="mb-4">
                                Интуитивный и понятный интерфейс, актуальность и практичность применения
                                делают его интересным и полезным (востребованным) для широкой аудитории: студенты, взрослые, предприниматели
                                и даже моей Маме и её подругам как молоток и отвертка в каждом доме
                            </p>
                            <div class="d-flex flex-wrap gap-3">
                                <RouterLink to="/signup" class="btn btn-light btn-lg">
                                    <i class="bi bi-person-plus me-2"></i>Начать
                                </RouterLink>
                                <RouterLink to="/about" class="btn btn-outline-light btn-lg">
                                    <i class="bi bi-info-circle me-2"></i>Узнать больше
                                </RouterLink>
                            </div>
                        </div>
                        <div class="col-lg-6 mt-5 mt-lg-0">
                            <div class="hero-image mb-4">
                                <img src="https://via.placeholder.com/800x400/000000/FFFFFF?text=IMI+Club+Hero" alt="IMI Club" class="img-fluid rounded shadow">
                            </div>
                            <div class="swiper hero-swiper">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide">
                                        <div class="card bg-dark border-0 text-white p-4 h-100">
                                            <div class="card-body">
                                                <img src="https://via.placeholder.com/400x200/1a1a1a/FFFFFF?text=Слайд+1" alt="Слайд 1" class="img-fluid rounded mb-3">
                                                <h3 class="card-title">Слайд 1</h3>
                                                <p class="card-text">IMI Club - это социальный проект и комплекс надежных сервис инструментов</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="swiper-slide">
                                        <div class="card bg-dark border-0 text-white p-4 h-100">
                                            <div class="card-body">
                                                <img src="https://via.placeholder.com/400x200/1a1a1a/FFFFFF?text=Слайд+2" alt="Слайд 2" class="img-fluid rounded mb-3">
                                                <h3 class="card-title">Слайд 2</h3>
                                                <p class="card-text">Многофункциональная инновационная экосистема</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="swiper-slide">
                                        <div class="card bg-dark border-0 text-white p-4 h-100">
                                            <div class="card-body">
                                                <img src="https://via.placeholder.com/400x200/1a1a1a/FFFFFF?text=Слайд+3" alt="Слайд 3" class="img-fluid rounded mb-3">
                                                <h3 class="card-title">Слайд 3</h3>
                                                <p class="card-text">Высшей ценностью является Человек</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="about-section bg-white py-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mx-auto">
                            <h2 class="display-5 fw-bold text-center mb-5">О проекте</h2>
                            <div class="about-image mb-4 text-center">
                                <img src="https://via.placeholder.com/800x300/000000/FFFFFF?text=О+проекте+IMI+Club" alt="О проекте IMI Club" class="img-fluid rounded shadow">
                            </div>
                            <div class="card border-0 shadow-sm mb-4">
                                <div class="card-body p-4">
                                    <p class="mb-3">
                                        <strong>IMI Club</strong> - это социальный проект
                                        представляет собой многофункциональную инновационную экосистему, которая объединяет различные сервисы, приложения, продукты, услуги направленные на улучшение качества жизни человека во всех базовых сферах
                                    </p>
                                    <p class="mb-0">
                                        Основная цель проекта — создать единую платформу инструментов, в рамках одного окна которая будет охватывать разнообразные потребности интересы пользователей, предлагая удобные, качественные и инновационные решения.
                                    </p>
                                </div>
                            </div>
                            <div class="card bg-black text-white border-0">
                                <div class="card-body p-4 text-center">
                                    <div class="highlight-image mb-3">
                                        <img src="https://via.placeholder.com/600x200/000000/FFFFFF?text=IMI+Club+ценность" alt="IMI Club ценность" class="img-fluid rounded">
                                    </div>
                                    <i class="bi bi-heart-fill display-4 mb-3"></i>
                                    <h3 class="fw-bold mb-3">
                                        IMI Club - EcoSystems где высшей ценностью является Человек
                                    </h3>
                                    <p class="mb-3">
                                        С IMI club - каждый Человек становится не только пользователем,
                                        а совладельцем экосистемы уже с первых шагов!
                                    </p>
                                    <p class="mb-0">
                                        Благодаря авторской концепции, это всё доступно на самых выгодных условиях!
                                        качественно, надежно, актуально и интересно!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features-section bg-light py-5">
                <div class="container">
                    <h2 class="display-5 fw-bold text-center mb-5">Ключевые элементы проекта</h2>
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-3">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="feature-image mb-3">
                                        <img src="https://via.placeholder.com/300x150/000000/FFFFFF?text=IMI+Store" alt="IMI Store" class="img-fluid rounded">
                                    </div>
                                    <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                        <i class="bi bi-shop fs-3"></i>
                                    </div>
                                    <h5 class="fw-bold mb-3">IMI Store</h5>
                                    <p class="text-muted small">
                                        Гибридный партнерский CPA-маркет, который объединяет товары и услуги от различных партнеров с кешбэком.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="feature-image mb-3">
                                        <img src="https://via.placeholder.com/300x150/000000/FFFFFF?text=Экосистема" alt="Экосистема" class="img-fluid rounded">
                                    </div>
                                    <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                        <i class="bi bi-globe fs-3"></i>
                                    </div>
                                    <h5 class="fw-bold mb-3">Экосистема</h5>
                                    <p class="text-muted small">
                                        Широкий спектр сервисов: финансы, здоровье, образование, развлечения, путешествия.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="feature-image mb-3">
                                        <img src="https://via.placeholder.com/300x150/000000/FFFFFF?text=Привилегии" alt="Привилегии" class="img-fluid rounded">
                                    </div>
                                    <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                        <i class="bi bi-gift fs-3"></i>
                                    </div>
                                    <h5 class="fw-bold mb-3">Привилегии</h5>
                                    <p class="text-muted small">
                                        Кешбэк, бонусы, скидки и другие привилегии для активных пользователей.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-body p-4">
                                    <div class="feature-image mb-3">
                                        <img src="https://via.placeholder.com/300x150/000000/FFFFFF?text=Инновации" alt="Инновации" class="img-fluid rounded">
                                    </div>
                                    <div class="bg-black text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                        <i class="bi bi-lightning-charge fs-3"></i>
                                    </div>
                                    <h5 class="fw-bold mb-3">Инновации</h5>
                                    <p class="text-muted small">
                                        Современные технологии для удобного и безопасного пользовательского опыта.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="advantages-section bg-white py-5">
                <div class="container">
                    <h2 class="display-5 fw-bold text-center mb-5">Преимущества IMI Club</h2>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="d-flex align-items-start">
                                <i class="bi bi-check-circle-fill text-black me-3 fs-5"></i>
                                <span>Универсальность: охват всех сфер жизни человека</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-start">
                                <i class="bi bi-check-circle-fill text-black me-3 fs-5"></i>
                                <span>Выгода для пользователей: кешбэк, бонусы и привилегии</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-start">
                                <i class="bi bi-check-circle-fill text-black me-3 fs-5"></i>
                                <span>Партнерские возможности: эффективный CPA-маркетинг</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-start">
                                <i class="bi bi-check-circle-fill text-black me-3 fs-5"></i>
                                <span>Социальная составляющая: создание взаимовыгодного сообщества</span>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-5">
                        <div class="col-lg-8 mx-auto">
                            <div class="card bg-light border-0">
                                <div class="card-body p-4">
                                    <p class="mb-0 fst-italic text-center">
                                        Таким образом, IMI Club позиционируется как инновационная платформа, которая объединяет коммерческие, социальные и технологические аспекты сервисов для создания экосистемы, ориентированной на улучшение жизни человека и его развитие.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="cta-section bg-black text-white py-5">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mx-auto text-center">
                            <div class="cta-image mb-4">
                                <img src="https://via.placeholder.com/800x300/000000/FFFFFF?text=Присоединяйтесь" alt="Присоединяйтесь" class="img-fluid rounded">
                            </div>
                            <h2 class="display-5 fw-bold mb-4">Готовы начать?</h2>
                            <p class="lead mb-4">Присоединяйтесь к экосистеме IMI Club уже сегодня</p>
                            <div class="d-flex flex-wrap gap-3 justify-content-center">
                                <RouterLink to="/signup" class="btn btn-light btn-lg">
                                    <i class="bi bi-person-plus me-2"></i>Зарегистрироваться
                                </RouterLink>
                                <RouterLink to="/partners" class="btn btn-outline-light btn-lg">
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
            const heroSwiper = document.querySelector('.hero-swiper');
            if (heroSwiper) {
                new window.Swiper(heroSwiper, {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    autoplay: {
                        delay: 5000,
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

.min-vh-50 {
    min-height: 50vh;
}

.hero-swiper {
    height: 300px;
}

.swiper-slide {
    height: auto;
}

.swiper-pagination {
    position: relative;
    margin-top: 20px;
}

.swiper-pagination-bullet {
    background: white;
    opacity: 0.5;
}

.swiper-pagination-bullet-active {
    opacity: 1;
}

.hero-image img,
.about-image img,
.highlight-image img,
.feature-image img,
.cta-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.hero-image img {
    max-height: 400px;
}

.about-image img {
    max-height: 300px;
}

.highlight-image img {
    max-height: 200px;
}

.feature-image img {
    max-height: 150px;
}

.cta-image img {
    max-height: 300px;
}
</style>
