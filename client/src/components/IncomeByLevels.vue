<script setup>
import { ref } from "vue";
import apiService from '@/services/apiService';

import Autocounter from '@/components/Autocounter.vue'

import { useNotifications } from '@/composables/useNotifications';
const { onNotify } = useNotifications();

const structure = ref([])
const update = async () => {
    structure.value = await apiService.getIncomeByLevel()
}

update();

onNotify((data) => {
    if (data.notification?.category == 'wallet') {
        update();
    }
})

const levelToIcon = (level) => `bi-${level}-square`

const levels = {
    1: 8,
    2: 4,
    3: 4,
    4: 4,
    5: 4,
    6: 3,
    7: 3,
}
const levelToReward = (level) => levels[level]
</script>


<template>

    <div class="card adminuiux-card">
        <div class="card-header">
            <h6>Структура</h6>
        </div>
        <ul class="list-group list-group-flush border-top bg-none">
            <li v-for="item in structure" class="list-group-item">
                <div class="row gx-3 align-items-center">
                    <div class="col-auto">
                        <i class="bi avatar avatar-40 h5 rounded-circle" :class="levelToIcon(item.level)"></i>
                    </div>
                    <div class="col">
                        <p class="mb-1 fw-medium">
                            Линия {{ item.level }}
                        </p>
                        <p class="small text-secondary">
                            <i class="bi bi-plus"></i>
                            {{ levelToReward(item.level) }}% от каждой продажи

                        </p>
                    </div>
                    <div class="col-auto text-end">
                        <h6>{{ item.totalAmount }}₽ </h6>
                        <p class="small text-success">
                            <i class="bi bi-bag-check"></i>
                            {{ item.rewardCount
                            }} продаж
                        </p>
                    </div>
                </div>
            </li>

        </ul>
    </div>
</template>