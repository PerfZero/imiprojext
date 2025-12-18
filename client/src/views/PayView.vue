<template>
    <!-- page title -->
        <div class="container-fluid py-3">
            <div class="row gx-3 align-items-center page-title">
                <div class="col col-sm">
                    <h5 class="mb-0">Send Money</h5>
                    <p class="text-secondary small">
                        Instant fund transfer to contacts
                    </p>
                </div>
            </div>
            <nav
                aria-label="breadcrumb"
                class="breadcrumb-theme mt-3 rounded d-none d-lg-block"
            >
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item bi">
                        <a href="template-dashboard.html"
                            ><i class="bi bi-house-door me-2"></i> Home</a
                        >
                    </li>
                    <li class="breadcrumb-item bi active" aria-current="page">
                        Send Money
                    </li>
                </ol>
            </nav>
        </div>
        <!-- Content  -->
        <div class="container mt-3" id="main-content">
            <div
                class="row gx-3 gx-lg-4 justify-content-center minheight-dynamic"
                style="
                    --mih-dynamic: calc(
                        100vh - 215px - env(safe-area-inset-bottom) -
                            env(safe-area-inset-top)
                    );
                "
            >
                <div
                    class="col-12 col-md-7 col-lg-6 col-xl-5 col-xxl-4 mb-auto"
                >
                    <div class="form-floating mb-3">
                        <input
                            type="text"
                            class="form-control"
                            id="contact"
                            placeholder="Enter contact..."
                            value="Jonathan"
                        />
                        <label for="contact">Send money to</label>
                    </div>
                    <p class="small text-secondary text-center">
                        Recently connected contacts
                    </p>
                    <!-- recent connection -->
                    <div class="swiper swipernav mb-3">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle border border-dotted border-theme"
                                >
                                    <span class="h4">+</span>
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-1.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-3.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-4.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-5.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-6.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-8.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-3.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div class="swiper-slide w-auto">
                                <div
                                    class="avatar avatar-40 rounded-circle coverimg"
                                >
                                    <img
                                        src="/assets/img/template/user-4.jpg"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <input
                        type="number"
                        class="form-control form-control-lg text-center mb-3 fs-2 fw-bold"
                        id="ihavei"
                        placeholder="Convert Amount..."
                        value="100.00"
                    />
                    <div class="row mb-4">
                        <div class="col">
                            <div class="form-floating mb-1">
                                <select class="form-select" id="ihavecurrencyi">
                                    <option>USD Wallet</option>
                                    <option>CAD Wallet</option>
                                    <option>AUD Wallet</option>
                                </select>
                                <label for="ihavecurrencyi">From...</label>
                            </div>
                            <p class="small text-secondary text-center">
                                1.00 USD
                            </p>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-square btn-theme mt-2">
                                <i class="bi bi-arrow-left-right"></i>
                            </button>
                        </div>
                        <div class="col">
                            <div class="form-floating mb-1">
                                <select
                                    class="form-select"
                                    id="ihavecurrency2i"
                                >
                                    <option>USD</option>
                                    <option selected="">CAD</option>
                                    <option>AUD</option>
                                </select>
                                <label for="ihavecurrency2i">Send in...</label>
                            </div>
                            <p class="small text-secondary text-center">
                                1.38 CAD
                            </p>
                        </div>
                    </div>
                    <div class="text-center">
                        <h5 class="fw-normal">
                            <b class="fw-bold">Great!</b> You are going to send
                        </h5>
                        <h1 class="mb-0 text-theme-1">100.00</h1>
                        <p class="text-secondary small">in Canadian Dollar</p>
                    </div>
                    <div
                        class="alert alert-danger alert-dismissible fade show mt-4"
                        role="alert"
                    >
                        <strong
                            ><i class="bi bi-exclamation-triangle me-1"></i> Low
                            balance!</strong
                        ><br />
                        <small
                            >Your wallet account does not have enough money to
                            send. Kindly add money or choose different wallet
                            account.</small
                        >
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
                <div class="col-12 mb-3 mb-lg-4"></div>
                <div class="col-12 col-md-auto mx-auto mb-3 mb-lg-4 mt-auto">
                    <button class="btn btn-theme w-100">Send Now</button>
                </div>
            </div>
        </div>
</template>
