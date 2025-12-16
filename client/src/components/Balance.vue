<script setup>
import { ref } from "vue";
import apiService from '@/services/apiService';

import Autocounter from '@/components/Autocounter.vue'

import { useNotifications } from '@/composables/useNotifications';
const { onNotify } = useNotifications();

const balances = ref([])
const update = async () => {
    balances.value = await apiService.getUserBalances()
}

update();

onNotify((data) => {
    if (data.notification?.category == 'wallet' || data.notification?.category == 'mlm') {
        update();
    }
})

</script>

<template>
    <!-- balance -->
    <div class="">
        <div class="card adminuiux-card bg-theme-r-gradient" style="color: white">
            <div class="card-header">
                <h6>Личный счет</h6>
            </div>
            <ul class="list-group list-group-flush border-top border-light bg-none">
                <li v-for="item in balances" class="list-group-item" style="color: white">
                    <div class="row gx-3 align-items-center">
                        <div class="col-auto">
                            <i class="bi bi-currency-dollar avatar avatar-40 h5 rounded-circle border"></i>
                        </div>
                        <div class="col">
                            <p class="small text-secondary"></p>
                        </div>
                        <div class="col-auto fs-6 text-end">
                            <h6>
                                <Autocounter :count="item.balance" /> {{ item.currency }}
                            </h6>

                        </div>
                    </div>
                </li>

            </ul>
        </div>
    </div>
</template>