<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { authClient } from "@/lib/auth-client";
const session = authClient.useSession();
import apiService from '@/services/apiService';

const referrer = ref({})
const update = async () => {
    referrer.value = await apiService.getUserReferrer();
}
update()

</script>

<template>
    <div class="card bg-gradient-8 mb-3 mb-lg-4">
        <div class="card-body">
            <div class="row gx-3 align-items-center flex-nowrap mb-3">
                <div class="col-auto">
                    <div class="avatar avatar-40 rounded-circle bg-theme-1 d-flex align-items-center justify-content-center">
                        <i class="bi bi-person-fill text-white" style="font-size: 1.25rem; line-height: 1;"></i>
                    </div>
                </div>
                <div class="col maxwidth-200">
                    <h5 v-if="referrer.name == '-'" class="mb-0 text-truncated">
                        {{ referrer.email }}
                    </h5>
                    <h5 v-else class="mb-0 text-truncated">
                        {{ referrer.name }}
                    </h5>
                    <p class="small text-secondary">
                        Ваш реферер
                    </p>
                </div>
            </div>
            <div class="row gx-3 gx-lg-4">
                <div class="col-12 col-md-6">
                    <p class="text-secondary mb-2">
                        <i class="bi bi-envelope"></i>
                        {{ referrer.email }}
                    </p>
                    <p class="text-secondary mb-2">
                        <i class="bi bi-whatsapp"></i> {{ referrer.phone }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
