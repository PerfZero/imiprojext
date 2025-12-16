<script setup>
import { ref, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import Avatar from "vue-boring-avatars";
import { authClient } from "@/lib/auth-client";
import apiService from '@/services/apiService';


const { showToast } = useToast();

const session = authClient.useSession();

// Состояния для отображения ошибок
const errorMessage = ref('');
const showError = ref(false);

// Состояния для полей формы
const name = ref('');
const phone = ref('');

// Следим за изменением сессии и обновляем значения полей
watch(() => session.value?.data?.user, (newUser) => {
    if (newUser) {
        name.value = newUser.name || '';
        phone.value = newUser.phone || '';
    }
}, { immediate: true });

const uploadPhoto = () => {
    // Создаем элемент input для выбора файла
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Принимаем только изображения

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Проверяем размер файла (например, не более 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла слишком большой. Пожалуйста, выберите файл меньше 5MB.');
            return;
        }

        try {
            // Отправляем файл на сервер
            const response = await apiService.uploadAvatar(file);
            console.log('Аватар успешно загружен:', response);
            console.log('session:', session);
            // Обновляем сессию с новым изображением
            if (response && response.image) {
                // Обновляем данные сессии, чтобы отразить новый аватар
                session.value.data.user.image = response.image;
                console.log('Аватар успешно загружен:', response);

                await authClient.updateUser({
                    image: response.image
                })
            }
        } catch (error) {
            console.error('Ошибка при загрузке аватара:', error);
            alert('Ошибка при загрузке аватара. Пожалуйста, попробуйте еще раз.');
        }
    };

    input.click();
};

// Функция обновления профиля
const updateProfile = async () => {
    // Сбрасываем предыдущую ошибку
    showError.value = false;
    errorMessage.value = '';
    // Проверяем, что поля не пустые
    if (!name.value.trim()) {
        errorMessage.value = 'Имя не может быть пустым';
        showError.value = true;
        return;
    }

    if (!phone.value.trim()) {
        errorMessage.value = 'Телефон не может быть пустым';
        showError.value = true;
        return;
    }

    try {
        // Отправляем обновленные данные на сервер
        const response = await authClient.updateUser({
            name: name.value,
            phone: phone.value
        });

        // При успешном ответе показываем уведомление
        showToast('Успех', 'Профиль успешно обновлён!', 5000);
    } catch (error) {
        // В случае ошибки показываем сообщение об ошибке
        if (error && error.error) {
            // Если сервер вернул конкретное сообщение об ошибке
            errorMessage.value = error.error;
        } else {
            errorMessage.value = 'Не удалось обновить профиль. Попробуйте ещё раз.';
        }

        showError.value = true;
        console.error('Ошибка при обновлении профиля:', error);
    }

};
</script>

<template>
    <main class="adminuiux-content has-sidebar" onclick="contentClick()">
        <!-- page title -->
        <div class="container-fluid py-3">
            <div class="row gx-3 align-items-center page-title">
                <div class="col col-sm">
                    <h5 class="mb-0">Редактирование профиля</h5>
                    <p class="text-secondary small">Обновите ваши данные</p>
                </div>
                <div class="col-auto position-relative">
                </div>
            </div>
            <nav aria-label="breadcrumb" class="breadcrumb-theme mt-3 rounded d-none d-lg-block">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item bi"><a href="template-dashboard.html"><i
                                class="bi bi-house-door me-2"></i>
                            Главная</a></li>
                    <li class="breadcrumb-item bi active" aria-current="page"> Редактировать профиль</li>
                </ol>
            </nav>
        </div>
        <!-- content -->
        <div class="container mt-3" id="main-content">
            <div class="card adminuiux-card bg-theme-1 overflow-hidden mb-3 pt-5">
                <figure
                    class="coverimg start-0 top-0 w-100 h-100 z-index-0 position-absolute overlay-gradiant opacity-50">
                    <!-- <div class="position-absolute top-0 end-0 m-2">
                        <button class="btn btn-sm btn-light" onclick="$(this).next().click()">
                            <i class="bi bi-camera"></i> Change Cover
                        </button>
                        <input type="file" class="d-none">
                    </div> -->
                    <img src="/assets/img/template/splash01.svg" class="mw-100" alt="">
                </figure>
                <div class="card-body text-center text-white z-index-1">
                    <div class="d-inline-block position-relative w-auto mx-auto my-3">
                        <Avatar v-if="!session.data?.user.image" :name="session.data?.user.email" variant="beam"
                            class="avatar avatar-150 coverimg rounded-circle" />

                        <figure v-else class="avatar avatar-150 coverimg rounded-circle">
                            <img :src="session.data?.user.image" alt="">
                        </figure>

                        <div class="position-absolute bottom-0 end-0 z-index-1 h-auto">
                            <button @click="uploadPhoto" class="btn btn-theme btn-square">
                                <i class=" bi bi-camera"></i>
                            </button>
                            <input type="file" class="d-none">
                        </div>
                    </div>
                    <h4 class="mb-0">{{ session.data?.user.name }}</h4>
                    <p class="opacity-75 mb-3">{{ session.data?.user.email }}</p>
                </div>
            </div>
            <div class="card bg-none mb-3 mb-lg-4">
                <div class="card-body">
                    <div class="row gx-3 mb-2">
                        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                            <div class="form-floating mb-3">
                                <input v-model="name" placeholder="First Name" required="" class="form-control ">
                                <label>Имя Фамилия</label>
                            </div>
                            <div class="invalid-feedback">Please enter valid input</div>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
                            <div class="form-floating">
                                <input v-model="phone" type="tel" placeholder="Phone Number" required=""
                                    class="form-control">
                                <label>Телефон</label>
                            </div>
                            <div class="invalid-feedback">Please enter a valid phone number</div>
                        </div>


                    </div>

                </div>
            </div>
            <div class="row gx-3 mb-3 mb-lg-4">
                <div v-if="showError" class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                    <strong><i class="bi bi-exclamation-triangle me-1"></i>Ошибка</strong>
                    <br />
                    {{ errorMessage }}
                    <button type="button" class="btn-close" @click="showError = false" data-bs-dismiss="alert"
                        aria-label="Close"></button>
                </div>
                <div class="col"><button @click="updateProfile" class="btn btn-theme">Сохранить</button></div>
                <div class="col-auto"><button class="btn btn-link theme-red">Отмена</button></div>
            </div>
        </div>
    </main>
</template>
