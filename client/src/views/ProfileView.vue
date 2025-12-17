<script setup>
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();

</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <!-- page title -->
        <div class="container-fluid py-3">
            <div class="row gx-3 align-items-center page-title">
                <div class="col col-sm">
                    <h5 class="mb-0">Мой профиль</h5>
                    <p class="text-secondary small">
                        Учетные данные
                    </p>
                </div>
                <div class="col-auto position-relative">
                    <RouterLink to="/profile-settings" class="btn btn-link btn-square">
                        <i class="bi bi-pencil"></i>
                    </RouterLink>
                </div>
            </div>
            <nav aria-label="breadcrumb" class="breadcrumb-theme mt-3 rounded d-none d-lg-block">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item bi">
                        <RouterLink to="/dashboard"><i class="bi bi-house-door me-2"></i> Главная</RouterLink>
                    </li>
                    <li class="breadcrumb-item bi active" aria-current="page">
                        Мой профиль
                    </li>
                </ol>
            </nav>
        </div>
        <!-- content -->
        <div class="container mt-3" id="main-content">
            <div class="row gx-3 gx-lg-4">
                <div class="col-12 col-md-12 col-xl-4">
                    <div class="card bg-none mb-3 mb-lg-4 overflow-hidden">
                        <div class="height-150 w-100 bg-theme-1">
                            <figure class="h-100 w-100 coverimg opacity-50">
                            </figure>
                        </div>
                        <div class="card-body pt-3">
                            <div class="mb-3">
                                <h4 class="fw-bold text-theme-1 mb-0">
                                    {{ session.data?.user.name }}
                                </h4>
                                <p class="small text-secondary mb-0">
                                    Новичок
                                </p>
                            </div>

                            <p class="text-truncated">
                                <i
                                    class="bi bi-envelope text-secondary avatar avatar-30 bg-theme-1-subtle text-theme-1 theme-black rounded-circle me-2 align-middle"></i>
                                <span class="align-middle">{{ session.data?.user.email }}</span>
                            </p>
                            <p class="text-truncated">
                                <i
                                    class="bi bi-telephone text-secondary avatar avatar-30 bg-theme-1-subtle text-theme-1 theme-black rounded-circle me-2 align-middle"></i>
                                <span class="align-middle">{{ session.data?.user.phone }}</span>
                            </p>

                        </div>
                    </div>
                </div>

            </div>
        </div>

    </main>
</template>
