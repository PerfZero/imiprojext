<script setup>
import { ref, computed } from 'vue'
import { formatTimestamp } from '@/utils/formatDateTime'
import { useToast } from '@/composables/useToast'
const { showToast } = useToast();

import { useNotifications } from '@/composables/useNotifications';

const { onNotify, notifications, markAsReadAll } = useNotifications();

onNotify((data) => {
    if (data.notification?.category) {
        showToast(data.notification.category, data.notification.message, 5000)
    }
})
const isNotificationsTruncated = ref(false)
const notificationsFiltered = computed(() => {
    if (notifications.value.length > 5) {
        isNotificationsTruncated.value = true;
        return notifications.value.slice(0, 5);
    } else {
        isNotificationsTruncated.value = false;
        return notifications.value;
    }
})

</script>

<template>
    <!-- <div class="notifications">
        <div v-for="notification in notifications" :key="notification.id">
            {{ notification.message }}
            <button @click="markAsRead(notification.id)">Прочитано</button>
        </div>
    </div> -->
    <!-- notification dropdown -->
    <div class="dropdown d-inline-block ">
        <button class="btn btn-link btn-square btn-icon btn-link-header dropdown-toggle no-caret" type="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <i data-feather="bell"></i>
            <span v-if="notifications.length > 0" style="min-width:20px;"
                class="position-absolute top-0 end-0 badge rounded-pill bg-danger p-1">
                <small>{{ notifications.length }}</small>
                <span class="visually-hidden">unread messages</span>
            </span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end notification-dd ">
            <li v-for="notification in notificationsFiltered" :key="notification.id">
                <div class="dropdown-item flex flex-row" href="#">
                    <div class="d-flex align-items-center mb-3">
                        <!-- Аватар слева -->
                        <div class="flex-shrink-0 me-3">
                            <i class="bi avatar avatar-40 bi-wallet h5 rounded-circle"></i>
                        </div>

                        <!-- Имя и email справа -->
                        <div class="flex-grow-1 text-start">
                            <p class="mb-0">
                                {{
                                    notification.message }}
                                <!-- <span class="fw-bold">12 000 руб.</span> на ваш счет. -->
                            </p>
                            <span class="row">
                                <span class="col"><span class="badge badge-light rounded-pill text-bg-warning small">{{
                                    notification.category }}</span></span>
                                <span class="col-auto small opacity-50">{{
                                    formatTimestamp(notification.createdAt) }}</span>
                            </span>
                        </div>
                    </div>


                    <div>

                    </div>


                </div>
            </li>
            <!-- <li>
                <a class="dropdown-item" href="#">
                    <p class="mb-0">
                        <span class="fw-bold">Иван Иванов</span>
                        пришел по вашей ссылке.
                    </p>
                    <span class="row">
                        <span class="col"><span
                                class="badge badge-light rounded-pill text-bg-primary small">Рефералы</span></span>
                        <span class="col-auto small opacity-50">15:00</span>
                    </span>
                </a>
            </li>
            <li>
                <a class="dropdown-item" href="#">
                    <p class="mb-0">
                        <span class="fw-bold">70 000 руб.</span> успешно
                        выведены
                    </p>
                    <span class="row">
                        <span class="col"><span
                                class="badge badge-light rounded-pill text-bg-success small">Кошелек</span></span>
                        <span class="col-auto small opacity-50">12:00</span>
                    </span>
                </a>
            </li> -->

            <li v-if="isNotificationsTruncated" class="text-center">
                <button class="btn btn-link text-center fs-12" @click="markAsReadAll()">

                    Скрытые сообщения ({{ notifications.length - notificationsFiltered.length }})
                </button>
            </li>
            <li class="text-center">
                <button class="btn btn-link text-center fs-12" @click="markAsReadAll()">
                    <i class="bi bi-envelope-open fs-14"></i>
                    Отметить все прочитанными
                </button>
            </li>
        </ul>
    </div>
</template>
