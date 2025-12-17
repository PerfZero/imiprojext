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
    <li v-for="item in balances" :key="item.currency" class="nav-item">
        <div class="nav-link">
            <i class="menu-icon bi bi-currency-dollar h4"></i>
            <span class="menu-name"><Autocounter :count="item.balance" /> {{ item.currency }}</span>
        </div>
    </li>
</template>