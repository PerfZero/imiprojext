<script setup>
import { useRoute } from "vue-router";

import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";
import AppBar from "@/components/AppBar.vue";

const route = useRoute();
</script>

<template>
    <slot v-if="route.meta.requiresAuth === false || route.meta.requiresAdmin" />
    <div v-else class="app-layout">
        <!-- Header -->
        <Header />

        <div class="adminuiux-wrap">
            <Sidebar />
            <main class="adminuiux-content has-sidebar" onclick="contentClick()" style="padding-top: 68px;">
                <slot />
            </main>
        </div>

        <!-- theming offcanvas-->
        <div class="offcanvas offcanvas-end shadow border-0" tabindex="-1" id="filter" data-bs-scroll="true"
            data-bs-backdrop="false" aria-labelledby="filterlabel">
            <div class="offcanvas-header border-bottom">
                <div>
                    <h5 class="offcanvas-title" id="filterlabel">Filter</h5>
                    <p class="text-secondary small">Grab the trimmed details</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <h6 class="offcanvas-title">Duration</h6>
                <p class="text-secondary small mb-3">
                    Filter details with desired period
                </p>
                <div class="row gx-2 align-items-center mb-3 mb-lg-4">
                    <div class="col">
                        <div class="input-group input-group-md">
                            <input type="text" class="form-control bg-transparent datepicker-single" value="" />
                            <span class="input-group-text text-theme-1 bg-transparent width-40" id="titlecalendar1"
                                onclick="this.previousElementSibling.click()"><i
                                    class="bi bi-calendar-event"></i></span>
                        </div>
                    </div>
                    <div class="col-auto text-secondary small">-</div>
                    <div class="col">
                        <div class="input-group input-group-md">
                            <input type="text" class="form-control bg-transparent datepicker-single" value="" />
                            <span class="input-group-text text-theme-1 bg-transparent width-40" id="titlecalendar2"
                                onclick="this.previousElementSibling.click()"><i
                                    class="bi bi-calendar-event"></i></span>
                        </div>
                    </div>
                </div>
                <h6 class="offcanvas-title">Country Selection</h6>
                <p class="text-secondary small mb-3">
                    Change country for operational details
                </p>
                <div class="mb-3 mb-lg-4">
                    <div class="input-group input-group-md rounded" style="--mw-dynamic: calc(100% - 42px)">
                        <span class="input-group-text text-theme-1"><i class="bi bi-box"></i></span>
                        <select class="form-control choices" id="titltfilterlist" multiple>
                            <option value="San Francisco">San Francisco</option>
                            <option value="New York">New York</option>
                            <option value="London">London</option>
                            <option value="Chicago">Chicago</option>
                            <option value="India" selected="">India</option>
                            <option value="Sydney">Sydney</option>
                            <option value="Seattle">Seattle</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="Chicago">Chicago</option>
                            <option value="India">India</option>
                        </select>
                    </div>
                    <div class="invalid-feedback">
                        You have already selected maximum option allowed. (This
                        is Configurable)
                    </div>
                </div>
                <h6 class="offcanvas-title">Orders</h6>
                <p class="text-secondary small mb-2">1256 orders last week</p>
                <div class="row mb-3 mb-lg-4">
                    <div class="col-12 px-0">
                        <ul class="list-group list-group-flush bg-transparent border-0">
                            <li class="list-group-item">
                                <div class="row gx-3 gx-lg-4">
                                    <div class="col">Online Orders</div>
                                    <div class="col-auto">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch"
                                                id="titleswitch1" />
                                            <label class="form-check-label" for="titleswitch1"></label>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="row gx-3 gx-lg-4">
                                    <div class="col">Offline Orders</div>
                                    <div class="col-auto">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" role="switch"
                                                id="titleswitch2" checked="" />
                                            <label class="form-check-label" for="titleswitch2"></label>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr class="mb-4" />
                <a href="template-company-help-center.html"
                    class="row gx-3 align-items-center style-none text-theme-1 mb-3 mb-lg-4" data-bs-toggle="tooltip"
                    data-bs-placement="top">
                    <div class="col-auto">
                        <i class="bi bi-life-preserver avatar avatar-30 bg-theme-1-subtle text-theme-1 rounded"></i>
                    </div>
                    <div class="col">
                        <p class="">Need help?</p>
                    </div>
                </a>
                <a href="https://1.envato.market/qjqoj" target="_blank"
                    class="row gx-3 align-items-center style-none text-theme-1 mb-3 mb-lg-4" data-bs-toggle="tooltip"
                    data-bs-placement="top">
                    <div class="col-auto">
                        <span
                            class="bi bi-basket avatar avatar-30 bg-theme-1-subtle text-theme-1 rounded position-relative">
                            <span class="position-absolute top-0 end-0 p-1 bg-green border border-light rounded-circle">
                                <span class="visually-hidden">New alerts</span>
                            </span>
                        </span>
                    </div>
                    <div class="col">
                        <p class="">Buy now and support us!</p>
                    </div>
                </a>
            </div>
            <div class="offcanvas-header border-top">
                <div class="col">
                    <button class="btn btn-theme" data-bs-dismiss="offcanvas">
                        Apply
                    </button>
                </div>
                <div class="col-auto">
                    <button class="btn btn-link theme-red" data-bs-dismiss="offcanvas">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        <!-- notification -->
        <div class="offcanvas offcanvas-end maxwidth-300" tabindex="-1" id="view-notification" data-bs-scroll="true"
            data-bs-backdrop="false">
            <div class="offcanvas-header border-bottom">
                <div class="flex-grow-1">
                    <h6 class="mb-0">Notifications</h6>
                    <p class="text-secondary">6 new updates</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="small text-center px-3 py-2 bg-theme-1-subtle text-theme-1 border-bottom">
                <div class="input-group">
                    <input type="text" class="form-control daterangepickers" />
                    <span class="input-group-text text-secondary">
                        <i class="bi bi-calendar-week"></i>
                    </span>
                </div>
            </div>
            <div class="offcanvas-body">
                <div class="card adminuiux-card mb-2">
                    <div class="card-body">
                        <div class="row gx-3">
                            <div class="col-auto">
                                <figure class="avatar avatar-30 coverimg rounded-circle">
                                    <img src="/assets/img/template/user-2.jpg" alt="" />
                                </figure>
                            </div>
                            <div class="col">
                                <p class="small mb-2">
                                    <a href="template-profile-professional.html" class="text-theme-1 style-none">Alex
                                        Smith</a>,
                                    <a href="template-profile-professional.html" class="text-theme-1 style-none">John
                                        McMillan</a>
                                    and
                                    <span class="fw-medium">36 others</span> are
                                    also ordered from same website
                                </p>
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <p class="text-secondary small">
                                            2:14 pm
                                        </p>
                                    </div>
                                    <div class="col-auto">
                                        <a href="javascript:void(0)" class="btn btn-sm btn-square btn-link theme-red"><i
                                                class="bi bi-trash"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card adminuiux-card mb-2">
                    <div class="card-body">
                        <div class="row gx-3">
                            <div class="col-auto">
                                <figure class="avatar avatar-30 rounded-circle bg-theme-1 border border-theme-1">
                                    <p class="h6 fw-medium">JM</p>
                                </figure>
                            </div>
                            <div class="col">
                                <p class="small mb-2">
                                    <a href="template-profile-professional.html" class="text-theme-1 style-none">Jack
                                        Mario</a>
                                    commented: "This one is most usable design
                                    with great user experience. w..."
                                </p>
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <p class="text-secondary small">
                                            2 days ago
                                        </p>
                                    </div>
                                    <div class="col-auto">
                                        <a href="javascript:void(0)" class="btn btn-sm btn-square btn-link theme-red"><i
                                                class="bi bi-trash"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="alert alert-warning mb-2">
                    <div class="row gx-3">
                        <div class="col-auto">
                            <figure class="avatar avatar-30 rounded-circle bg-warning text-white">
                                <i class="bi bi-bell"></i>
                            </figure>
                        </div>
                        <div class="col">
                            <p class="small mb-2">
                                Your subscription going to expire soon. Please
                                <a href="template-subscription.html">upgrade</a>
                                to get service interrupt free.
                            </p>
                            <div class="row gx-3 align-items-center">
                                <div class="col">
                                    <p class="text-secondary small">
                                        4 days ago
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-square btn-link theme-red"><i
                                            class="bi bi-trash"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card adminuiux-card mb-2">
                    <div class="card-body">
                        <div class="row gx-3">
                            <div class="col-auto">
                                <figure class="avatar avatar-30 coverimg rounded-circle">
                                    <img src="/assets/img/template/user-4.jpg" alt="" />
                                </figure>
                            </div>
                            <div class="col">
                                <p class="small mb-2">
                                    <a href="template-invoice.html" class="text-theme-1 style-none">Roberto Carlos</a>
                                    has requested to send $120.00 money.
                                </p>
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <p class="text-secondary small">
                                            6 days ago
                                        </p>
                                    </div>
                                    <div class="col-auto">
                                        <a href="javascript:void(0)" class="btn btn-sm btn-square btn-link theme-red"><i
                                                class="bi bi-trash"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card adminuiux-card mb-2">
                    <div class="card-body">
                        <div class="row gx-3">
                            <div class="col-auto">
                                <figure
                                    class="avatar avatar-30 rounded-circle bg-theme-1-subtle text-theme-1 theme-orange">
                                    <i class="bi bi-calendar-event"></i>
                                </figure>
                            </div>
                            <div class="col">
                                <h6 class="mb-1">
                                    Adminuiux: #1 HTML Templates
                                </h6>
                                <p class="small mb-2">
                                    Learning for better user experience on
                                    Universal app. development
                                </p>
                                <div class="avatar-group mb-2">
                                    <figure class="avatar avatar-20 coverimg rounded-circle" data-bs-toggle="tooltip"
                                        title="Mickey">
                                        <img src="/assets/img/template/user-3.jpg" alt="" style="display: none" />
                                    </figure>
                                    <figure class="avatar avatar-20 coverimg rounded-circle" data-bs-toggle="tooltip"
                                        title="Jacky">
                                        <img src="/assets/img/template/user-4.jpg" alt="" />
                                    </figure>
                                    <div class="avatar avatar-20 bg-theme-1 rounded-circle">
                                        <small class="fs-10 vm">9+</small>
                                    </div>
                                    <span class="text-secondary small">
                                        are attending</span>
                                </div>
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <p class="text-secondary small">
                                            7 days ago
                                        </p>
                                    </div>
                                    <div class="col-auto">
                                        <a href="javascript:void(0)" class="btn btn-sm btn-square btn-link theme-red"><i
                                                class="bi bi-trash"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card adminuiux-card mb-2">
                    <div class="card-body">
                        <div class="row gx-3">
                            <div class="col-auto">
                                <figure class="avatar avatar-30 coverimg rounded-circle">
                                    <img src="/assets/img/template/user-3.jpg" alt="" />
                                </figure>
                            </div>
                            <div class="col">
                                <p class="small mb-2">
                                    <a href="adminuiux-profile-professional.html" class="text-theme-1 style-none">The
                                        AdminUIUX</a>
                                    commented: "Thank you so much for this deep
                                    view at Adminuiux..."
                                </p>
                                <div class="row gx-3 align-items-center">
                                    <div class="col">
                                        <p class="text-secondary small">
                                            1 year ago
                                        </p>
                                    </div>
                                    <div class="col-auto">
                                        <a href="javascript:void(0)" class="btn btn-sm btn-square btn-link theme-red"><i
                                                class="bi bi-trash"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- themes -->
        <!-- theming offcanvas-->
        <div class="offcanvas offcanvas-end width-350" tabindex="-1" id="theming" data-bs-scroll="true"
            data-bs-backdrop="false" aria-labelledby="theminglabel">
            <div class="offcanvas-header border-bottom">
                <div>
                    <h5 class="offcanvas-title" id="theminglabel">
                        Personalize
                    </h5>
                    <p class="text-secondary small">
                        Make it more like your own
                    </p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <h6 class="offcanvas-title">Colors</h6>
                <p class="text-secondary small mb-4">
                    Change colors of templates
                </p>
                <div class="row mb-4 theme-select">
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-default">
                                <i class="bi bi-arrow-clockwise"></i>
                            </span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-blue">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-theme-1 theme-blue"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-indigo">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-indigo"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-purple">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-purple"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-pink">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-pink"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-red">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-red"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-orange">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-orange"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-yellow">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-yellow"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-green">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-green"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-teal">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-teal"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-cyan">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-cyan"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-grey">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-grey"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-brown">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-brown"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-chocolate">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-chocolate"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="theme-black">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-dark"></span>
                        </div>
                    </div>
                </div>
                <h6 class="offcanvas-title">Backgrounds</h6>
                <p class="text-secondary small mb-4">
                    Change color for background
                </p>
                <div class="row mb-4 theme-background">
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-default">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-default"><i
                                    class="bi bi-arrow-clockwise"></i></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-white">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-white"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-r-gradient">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-r-gradient"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-1">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-1"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-2">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-2"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-3">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-3"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-4">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-4"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-5">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-5"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-6">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-6"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-7">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-7"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-8">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-8"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-9">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-9"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="gradient-box text-center mb-2" data-title="bg-gradient-10">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-gradient-10"></span>
                        </div>
                    </div>
                </div>
                <h6 class="offcanvas-title">Sidebar Layout</h6>
                <p class="text-secondary small mb-4">
                    Change sidebar layout style
                </p>
                <div class="row mb-4 sidebar-layout">
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="adminuiux-sidebar-standard"
                            data-bs-toggle="tooltip" title="None">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-default">
                                <i class="bi bi-arrow-clockwise"></i>
                            </span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="adminuiux-sidebar-iconic"
                            data-bs-toggle="tooltip" title="Iconic">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-default">
                                <i class="bi bi-bezier h4"></i>
                            </span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2" data-title="adminuiux-sidebar-boxed"
                            data-bs-toggle="tooltip" title="Boxed">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-default">
                                <i class="bi bi-box h5"></i>
                            </span>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="select-box text-center mb-2"
                            data-title="adminuiux-sidebar-boxed adminuiux-sidebar-iconic" data-bs-toggle="tooltip"
                            title="Iconic+Boxed">
                            <span class="avatar avatar-40 rounded-circle mb-2 bg-default">
                                <i class="bi bi-bounding-box h5"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="text-center mb-4">
                    <a href="template-personalization.html" class="btn btn-sm btn-outline-theme">More options <i
                            class="bi bi-arrow-right-short"></i></a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <!-- <Footer /> -->

        <AppBar />
    </div>
</template>

<style scoped></style>
