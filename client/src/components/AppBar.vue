<template>
    <!-- mobile footer -->
    <!-- <footer class="adminuiux-mobile-footer hide-on-scrolldown style-4"> -->
    <footer class="adminuiux-mobile-footer style-4" style="bottom: -20px">
        <ul class="nav nav-pills justify-content-center">
            <li class="nav-item">
                <RouterLink to="/dashboard" class="nav-link">
                    <span>
                        <i class="nav-icon bi bi-house-door"></i>
                        <span class="nav-text">Главная</span>
                    </span>
                </RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="/pays" class="nav-link">
                    <span>
                        <i class="nav-icon bi bi-wallet"></i>
                        <span class="nav-text">Кошелек</span>
                    </span>
                </RouterLink>
            </li>

            <li class="nav-item">
                <RouterLink to="/profile" class="nav-link">
                    <span>
                        <i class="nav-icon avatar avatar-20 coverimg rounded-circle">
                            <img src="/assets/img/template/user-4.jpg" alt="" />
                        </i>
                        <span class="nav-text">Мой профиль</span>
                    </span>
                </RouterLink>
            </li>
        </ul>
    </footer>
</template>
