<script setup>
import "/assets/js/template/template-countdown.js?url";
</script>

<template>
    <!--Page body-->
    <div class="container-fluid">
        <!-- center wrap -->
        <div
            class="row justify-content-center align-items-center minheight-dynamic position-relative z-index-1"
            style="
                --mih-dynamic: calc(
                    100vh - 145px - env(safe-area-inset-bottom) -
                        env(safe-area-inset-top)
                );
            "
        >
            <div
                class="col-11 col-sm-8 col-lg-6 col-xxl-5 maxwidth-dynamic"
                style="--mw-dynamic: 600px"
            >
                <div class="mb-4 mb-lg-5 text-center">
                    <h1 class="text-white">Скоро запустим</h1>
                    <h5 class="">Скоро запустим</h5>
                </div>

                <p id="endtimer" class="my-4 my-lg-5"></p>
                <!-- subscription -->

                <!-- social links -->
                <div class="text-center">
                    <a
                        href="template-dashboard.html"
                        class="btn btn-square btn-link text-white rounded-circle"
                        data-toggle="tooltip"
                        title="Dashboard"
                        ><i class="bi bi-arrow-left"></i
                    ></a>
                    <a
                        href="#"
                        class="btn btn-square btn-link text-white rounded-circle"
                        target="_blank"
                        ><i class="bi bi-facebook"></i
                    ></a>
                    <a
                        href="#"
                        class="btn btn-square btn-link text-white rounded-circle"
                        target="_blank"
                        ><i class="bi bi-twitter"></i
                    ></a>
                    <a
                        href="#"
                        class="btn btn-square btn-link text-white rounded-circle"
                        target="_blank"
                        ><i class="bi bi-instagram"></i
                    ></a>
                    <a
                        href="#"
                        class="btn btn-square btn-link text-white rounded-circle"
                        target="_blank"
                        ><i class="bi bi-linkedin"></i
                    ></a>
                </div>
            </div>
        </div>
    </div>
</template>
