<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <!-- page title -->
        <div class="container-fluid py-3">
            <div class="row gx-3 align-items-center page-title">
                <div class="col">
                    <h5 class="mb-0">Wallet</h5>
                    <p class="text-secondary small">Manage your wallet</p>
                </div>
                <div class="col-auto">
                    <select class="form-select form-select-sm border-0">
                        <option>USD</option>
                        <option>CAD</option>
                        <option>AUD</option>
                    </select>
                </div>
                <div class="col-auto">
                    <button
                        class="btn btn-link btn-square"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#filter"
                        data-bs-placement="end"
                    >
                        <i class="bi bi-filter"></i>
                    </button>
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
                        Wallet
                    </li>
                </ol>
            </nav>
        </div>
        <!-- Content  -->
        <div class="container mt-3" id="main-content">
            <div class="row gx-3 gx-lg-4">
                <!-- cards  -->
                <div class="col-12 col-md-12 col-xl-6">
                    <div class="swiper swipernav">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide w-auto pb-3 pb-lg-4">
                                <a
                                    href="template-card-details.html"
                                    class="card adminuiux-card overflow-hidden width-300 style-none"
                                >
                                    <div
                                        class="card adminuiux-card bg-theme-1 overflow-hidden w-100"
                                    >
                                        <div
                                            class="coverimg h-100 w-100 position-absolute top-0 start-0 z-index-0 opacity-25"
                                        >
                                            <img
                                                src="/assets/img/template/splash01.svg"
                                                alt=""
                                            />
                                        </div>
                                        <div class="card-body z-index-1">
                                            <div
                                                class="row gx-3 align-items-center mb-3"
                                            >
                                                <div
                                                    class="col-auto align-self-center"
                                                >
                                                    <i
                                                        class="bi bi-credit-card fs-4"
                                                    ></i>
                                                </div>
                                                <div class="col text-end">
                                                    <p>
                                                        <span
                                                            class="small opacity-50"
                                                            >City Bank</span
                                                        ><br /><span class=""
                                                            >Credit Card</span
                                                        >
                                                    </p>
                                                </div>
                                            </div>
                                            <h4 class="fw-normal my-3 my-lg-4">
                                                000 0000 0001 546598
                                            </h4>
                                            <div class="row gx-3">
                                                <div class="col-auto">
                                                    <p
                                                        class="mb-0 small opacity-50"
                                                    >
                                                        Expiry
                                                    </p>
                                                    <p>09/023</p>
                                                </div>
                                                <div class="col text-end">
                                                    <p
                                                        class="mb-0 small opacity-50"
                                                    >
                                                        Card Holder
                                                    </p>
                                                    <p>adminuiux</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body z-index-1">
                                        <div
                                            class="row gx-3 align-items-center"
                                        >
                                            <div class="col">
                                                <h5>$11200.00</h5>
                                            </div>
                                            <div class="col-auto">
                                                <p class="text-secondary small">
                                                    US Dollar
                                                </p>
                                            </div>
                                            <div class="col-auto">
                                                <span
                                                    class="btn btn-square btn-sm btn-link"
                                                    ><i
                                                        class="bi bi-chevron-right"
                                                    ></i
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="swiper-slide w-auto pb-3 pb-lg-4">
                                <a
                                    href="template-card-details.html"
                                    class="card adminuiux-card overflow-hidden width-300 style-none"
                                >
                                    <div
                                        class="card adminuiux-card bg-theme-accent-1 overflow-hidden w-100"
                                    >
                                        <div
                                            class="coverimg h-100 w-100 position-absolute top-0 start-0 z-index-0 opacity-25"
                                        >
                                            <img
                                                src="/assets/img/template/splash01.svg"
                                                alt=""
                                            />
                                        </div>
                                        <div class="card-body z-index-1">
                                            <div
                                                class="row gx-3 align-items-center mb-3"
                                            >
                                                <div
                                                    class="col-auto align-self-center"
                                                >
                                                    <i
                                                        class="bi bi-credit-card fs-4"
                                                    ></i>
                                                </div>
                                                <div class="col text-end">
                                                    <p>
                                                        <span
                                                            class="small opacity-50"
                                                            >City Bank</span
                                                        ><br /><span class=""
                                                            >Credit Card</span
                                                        >
                                                    </p>
                                                </div>
                                            </div>
                                            <h4 class="fw-normal my-3 my-lg-4">
                                                000 0000 0001 56289
                                            </h4>
                                            <div class="row gx-3">
                                                <div class="col-auto">
                                                    <p
                                                        class="mb-0 small opacity-50"
                                                    >
                                                        Expiry
                                                    </p>
                                                    <p>09/023</p>
                                                </div>
                                                <div class="col text-end">
                                                    <p
                                                        class="mb-0 small opacity-50"
                                                    >
                                                        Card Holder
                                                    </p>
                                                    <p>adminuiux</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body z-index-1">
                                        <div
                                            class="row gx-3 align-items-center"
                                        >
                                            <div class="col">
                                                <h5>$ 61689.00</h5>
                                            </div>
                                            <div class="col-auto">
                                                <p class="text-secondary small">
                                                    US Dollar
                                                </p>
                                            </div>
                                            <div class="col-auto">
                                                <span
                                                    class="btn btn-square btn-sm btn-link"
                                                    ><i
                                                        class="bi bi-chevron-right"
                                                    ></i
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="swiper-slide w-auto pb-3 pb-lg-4">
                                <a
                                    href="template-card-details.html"
                                    class="card adminuiux-card overflow-hidden width-300 style-none"
                                >
                                    <div
                                        class="card adminuiux-card bg-r-gradient border-0 w-100 rounded-4"
                                    >
                                        <div
                                            class="card-body z-index-1 rounded"
                                        >
                                            <div
                                                class="row gx-3 align-items-center mb-3"
                                            >
                                                <div
                                                    class="col-auto align-self-center"
                                                >
                                                    <i
                                                        class="bi bi-credit-card fs-4"
                                                    ></i>
                                                </div>
                                                <div class="col text-end">
                                                    <p>
                                                        <span
                                                            class="small opacity-50"
                                                            >City Bank</span
                                                        ><br />
                                                        <span class=""
                                                            >Credit Card</span
                                                        >
                                                    </p>
                                                </div>
                                            </div>
                                            <h4 class="fw-normal my-3 my-lg-4">
                                                000 0000 0002 954582
                                            </h4>
                                            <div class="row gx-3">
                                                <div class="col-auto">
                                                    <p
                                                        class="mb-0 small opacity-50"
                                                    >
                                                        Expiry
                                                    </p>
                                                    <p>09/023</p>
                                                </div>
                                                <div class="col text-end">
                                                    <p
                                                        class="mb-0 small opacity-50"
                                                    >
                                                        Card Holder
                                                    </p>
                                                    <p>adminuiux</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body z-index-1">
                                        <div
                                            class="row gx-3 align-items-center"
                                        >
                                            <div class="col">
                                                <h5>$ 5012.00</h5>
                                            </div>
                                            <div class="col-auto">
                                                <p class="text-secondary small">
                                                    US Dollar
                                                </p>
                                            </div>
                                            <div class="col-auto">
                                                <span
                                                    class="btn btn-square btn-sm btn-link"
                                                    ><i
                                                        class="bi bi-chevron-right"
                                                    ></i
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- summary -->
                <div class="col-12 col-md-6 col-xl-4 col-xxl-3">
                    <div class="card adminuiux-card mb-3 mb-lg-4">
                        <div class="card-header">
                            <h2 class="mb-0">$ 1152.25k</h2>
                            <p class="text-secondary small">Total Balance</p>
                            <!-- chart blue -->
                        </div>
                        <div class="card-body p-0">
                            <div class="summarychart height-120 w-100">
                                <canvas id="areawallet"></canvas>
                            </div>
                        </div>
                        <div class="card-footer">
                            <p class="text-secondary">
                                Gross Income: $ 756.83
                                <span class="text-success"
                                    ><i class="bi bi-arrow-up-short"></i>
                                    11.5%</span
                                >
                            </p>
                        </div>
                    </div>
                </div>
                <!-- counts in out -->
                <div class="col-12 col-md-6 col-xl-2 col-xxl-3">
                    <div class="row gx-3 gx-lg-4">
                        <div class="col-6 col-md-12 mb-3 mb-lg-4">
                            <div
                                class="card adminuiux-card bg-theme-1-subtle theme-green"
                            >
                                <div class="card-body">
                                    <p class="text-secondary small mb-0">
                                        Received Money
                                    </p>
                                    <h2 class="mb-1">$8.34k</h2>
                                    <span
                                        class="badge badge-light text-bg-success"
                                        ><i
                                            class="me-1 bi bi-arrow-up-short"
                                        ></i
                                        >54.35%</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 mb-3 mb-lg-4">
                            <div
                                class="card adminuiux-card bg-theme-1-subtle theme-red"
                            >
                                <div class="card-body">
                                    <p class="text-secondary small mb-0">
                                        Sent Money
                                    </p>
                                    <h2 class="mb-1">$13.20k</h2>
                                    <span
                                        class="badge badge-light text-bg-danger"
                                        ><i
                                            class="me-1 bi bi-arrow-down-short"
                                        ></i
                                        >18.25%</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- send money to contacts -->
            <div class="row gx-3 align-items-center mb-3">
                <div class="col">
                    <h6>Send Money</h6>
                </div>
                <div class="col-auto"></div>
            </div>
            <div class="swiper swipernav mb-3 mb-lg-4">
                <div class="swiper-wrapper">
                    <div class="swiper-slide w-auto">
                        <a
                            href="template-sendmoney.html"
                            class="avatar avatar-40 rounded-circle border border-dotted border-theme style-none"
                        >
                            <span class="h4">+</span>
                        </a>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-1.jpg" alt="" />
                        </div>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-3.jpg" alt="" />
                        </div>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-4.jpg" alt="" />
                        </div>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-5.jpg" alt="" />
                        </div>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-6.jpg" alt="" />
                        </div>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-8.jpg" alt="" />
                        </div>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-3.jpg" alt="" />
                        </div>
                    </div>
                    <div class="swiper-slide w-auto">
                        <div class="avatar avatar-40 rounded-circle coverimg">
                            <img src="/assets/img/template/user-4.jpg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- recent transaction list -->
            <div class="row gx-3 align-items-center mb-3">
                <div class="col">
                    <h6>Recent Transactions</h6>
                </div>
                <div class="col-auto">
                    <a
                        href="template-transactions.html"
                        class="btn btn-sm btn-link text-center"
                    >
                        View all <i class="bi bi-chevron-right"></i>
                    </a>
                </div>
            </div>
            <div class="row">
                <div class="col-12 px-0">
                    <ul
                        class="list-group list-group-flush border-top border-bottom bg-none mb-3 mb-lg-4"
                    >
                        <li class="list-group-item">
                            <div class="row gx-3 align-items-center">
                                <div class="col-auto">
                                    <div
                                        class="avatar avatar-40 rounded-circle border coverimg"
                                    >
                                        <img
                                            src="/assets/img/template/image-10.jpg"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div class="col">
                                    <p class="mb-1 fw-medium">Send money</p>
                                    <p class="text-secondary small">
                                        12 Dec 2025, 12:50 PM
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <h6>- $ 150.00</h6>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="row gx-3 align-items-center">
                                <div class="col-auto">
                                    <div
                                        class="avatar avatar-40 rounded-circle border border-theme-1 bg-theme-1"
                                    >
                                        <h5>Ai</h5>
                                    </div>
                                </div>
                                <div class="col">
                                    <p class="mb-1 fw-medium">Paid Bill</p>
                                    <p class="text-secondary small">
                                        11 Dec 2025, 7:15 AM
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <h6>- $ 145.00</h6>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="row gx-3 align-items-center">
                                <div class="col-auto">
                                    <div
                                        class="avatar avatar-40 rounded-circle border"
                                    >
                                        <i class="bi bi-arrow-up-right h5"></i>
                                    </div>
                                </div>
                                <div class="col">
                                    <p class="mb-1 fw-medium">Paid Bill</p>
                                    <p class="text-secondary small">
                                        10 Nov 2025, 1:20 PM
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <h6>- $ 325.00</h6>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item theme-green">
                            <div class="row gx-3 align-items-center">
                                <div class="col-auto">
                                    <div
                                        class="avatar avatar-40 rounded-circle border border-theme-1 bg-theme-1-subtle text-theme-1"
                                    >
                                        <i class="bi bi-arrow-down-left h5"></i>
                                    </div>
                                </div>
                                <div class="col">
                                    <p class="mb-1 fw-medium">Received money</p>
                                    <p class="text-secondary small">
                                        5 Nov 2025, 1:45 AM
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <h6 class="text-theme-1">+ $ 562.00</h6>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="row gx-3 align-items-center">
                                <div class="col-auto">
                                    <div
                                        class="avatar avatar-40 rounded-circle border border-theme-1 bg-theme-1 theme-orange"
                                    >
                                        <h5>MS</h5>
                                    </div>
                                </div>
                                <div class="col">
                                    <p class="mb-1 fw-medium">Send money</p>
                                    <p class="text-secondary small">
                                        3 Nov 2025, 1:30 PM
                                    </p>
                                </div>
                                <div class="col-auto">
                                    <h6>- $ 356.00</h6>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- mobile footer -->
        <footer class="adminuiux-mobile-footer hide-on-scrolldown style-4">
            <ul class="nav nav-pills justify-content-center">
                <li class="nav-item">
                    <a class="nav-link" href="template-dashboard.html">
                        <span>
                            <i class="nav-icon bi bi-house-door"></i>
                            <span class="nav-text">Home</span>
                        </span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="template-wallet.html">
                        <span>
                            <i class="nav-icon bi bi-wallet"></i>
                            <span class="nav-text">Wallet</span>
                        </span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="template-statistics.html" class="nav-link">
                        <span>
                            <i class="nav-icon bi bi-clipboard-data"></i>
                            <span class="nav-text">Statistic</span>
                        </span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="template-profile.html">
                        <span>
                            <i
                                class="nav-icon avatar avatar-20 coverimg rounded-circle"
                            >
                                <img
                                    src="/assets/img/template/user-4.jpg"
                                    alt=""
                                />
                            </i>
                            <span class="nav-text">Profile</span>
                        </span>
                    </a>
                </li>
            </ul>
        </footer>
    </main>
</template>
