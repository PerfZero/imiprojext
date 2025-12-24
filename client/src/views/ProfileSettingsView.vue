<script setup>
import { ref, watch, onMounted } from 'vue';
import { useToast } from '@/composables/useToast';
import { authClient } from "@/lib/auth-client";
import apiService from '@/services/apiService';


const { showToast } = useToast();

const session = authClient.useSession();

const errorMessage = ref('');
const showError = ref(false);

const name = ref('');
const phone = ref('');

const verificationStatus = ref(null);
const verificationLoading = ref(false);
const uploadLoading = ref(false);
const passportPage1 = ref(null);
const passportPage2 = ref(null);
const selfieWithPassport = ref(null);
const passportPage1Preview = ref('');
const passportPage2Preview = ref('');
const selfieWithPassportPreview = ref('');

const addresses = ref([]);
const addressesLoading = ref(false);
const showAddressModal = ref(false);
const editingAddress = ref(null);
const addressForm = ref({
    name: '',
    phone: '',
    city: '',
    address: '',
    isDefault: false,
});

watch(() => session.value?.data?.user, (newUser) => {
    if (newUser) {
        name.value = newUser.name || '';
        phone.value = newUser.phone || '';
    }
}, { immediate: true });

const loadVerificationStatus = async () => {
    try {
        verificationLoading.value = true;
        const status = await apiService.getVerificationStatus();
        verificationStatus.value = status;
        
        if (status && status.status !== 'none') {
            passportPage1Preview.value = status.passportPage1Url || '';
            passportPage2Preview.value = status.passportPage2Url || '';
            selfieWithPassportPreview.value = status.selfieWithPassportUrl || '';
        }
    } catch (error) {
        console.error('Ошибка загрузки статуса верификации:', error);
    } finally {
        verificationLoading.value = false;
    }
};

const handleFileSelect = (field, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла слишком большой. Максимум 5MB.');
        return;
    }

    if (field === 'passportPage1') {
        passportPage1.value = file;
        passportPage1Preview.value = URL.createObjectURL(file);
    } else if (field === 'passportPage2') {
        passportPage2.value = file;
        passportPage2Preview.value = URL.createObjectURL(file);
    } else if (field === 'selfieWithPassport') {
        selfieWithPassport.value = file;
        selfieWithPassportPreview.value = URL.createObjectURL(file);
    }
};

const uploadVerificationDocuments = async () => {
    if (!passportPage1.value || !passportPage2.value || !selfieWithPassport.value) {
        alert('Пожалуйста, загрузите все три документа');
        return;
    }

    try {
        uploadLoading.value = true;
        await apiService.uploadVerificationDocuments({
            passportPage1: passportPage1.value,
            passportPage2: passportPage2.value,
            selfieWithPassport: selfieWithPassport.value,
        });
        showToast('Успех', 'Документы успешно загружены и отправлены на проверку', 5000);
        await loadVerificationStatus();
        passportPage1.value = null;
        passportPage2.value = null;
        selfieWithPassport.value = null;
    } catch (error) {
        alert(error.error || 'Ошибка при загрузке документов');
        console.error('Ошибка загрузки документов:', error);
    } finally {
        uploadLoading.value = false;
    }
};

const loadAddresses = async () => {
    try {
        addressesLoading.value = true;
        addresses.value = await apiService.getAddresses();
    } catch (error) {
        console.error('Ошибка загрузки адресов:', error);
    } finally {
        addressesLoading.value = false;
    }
};

const openAddressModal = (address = null) => {
    editingAddress.value = address;
    if (address) {
        addressForm.value = {
            name: address.name,
            phone: address.phone,
            city: address.city,
            address: address.address,
            isDefault: address.isDefault,
        };
    } else {
        addressForm.value = {
            name: session.value?.data?.user?.name || '',
            phone: session.value?.data?.user?.phone || '',
            city: '',
            address: '',
            isDefault: false,
        };
    }
    showAddressModal.value = true;
};

const closeAddressModal = () => {
    showAddressModal.value = false;
    editingAddress.value = null;
    addressForm.value = {
        name: '',
        phone: '',
        city: '',
        address: '',
        isDefault: false,
    };
};

const saveAddress = async () => {
    try {
        if (editingAddress.value) {
            await apiService.updateAddress(editingAddress.value.id, addressForm.value);
        } else {
            await apiService.createAddress(addressForm.value);
        }
        showToast('Успех', 'Адрес успешно сохранён', 3000);
        await loadAddresses();
        closeAddressModal();
    } catch (error) {
        alert(error.error || 'Ошибка при сохранении адреса');
    }
};

const deleteAddress = async (id) => {
    if (!confirm('Удалить адрес?')) return;
    try {
        await apiService.deleteAddress(id);
        showToast('Успех', 'Адрес удалён', 3000);
        await loadAddresses();
    } catch (error) {
        alert('Ошибка при удалении адреса');
    }
};

onMounted(() => {
    loadVerificationStatus();
    loadAddresses();
});

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
                    <li class="breadcrumb-item bi"><RouterLink to="/dashboard"><i
                                class="bi bi-house-door me-2"></i>
                            Главная</RouterLink></li>
                    <li class="breadcrumb-item bi active" aria-current="page"> Редактировать профиль</li>
                </ol>
            </nav>
        </div>
        <!-- content -->
        <div class="container mt-3" id="main-content">
            <div class="card adminuiux-card bg-theme-1 overflow-hidden mb-3 pt-5">
               
                <div class="card-body text-center text-white z-index-1">
                    <div class="d-inline-block position-relative w-auto mx-auto my-3">
                        <div class="avatar avatar-150 rounded-circle bg-theme-1 d-flex align-items-center justify-content-center">
                            <i class="bi bi-person-fill text-white" style="font-size: 4rem; line-height: 1;"></i>
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
                        aria-label="Закрыть"></button>
                </div>
                <div class="col"><button @click="updateProfile" class="btn btn-theme">Сохранить</button></div>
                <div class="col-auto"><button class="btn btn-link theme-red">Отмена</button></div>
            </div>

            <div class="card bg-none mb-3 mb-lg-4">
                <div class="card-body">
                    <h5 class="mb-3">Верификация</h5>
                    
                    <div v-if="verificationLoading" class="text-center py-3">
                        <div class="spinner-border spinner-border-sm" role="status"></div>
                    </div>

                    <div v-else>
                        <div class="mb-3">
                            <span class="badge" :class="{
                                'bg-warning': verificationStatus?.status === 'pending',
                                'bg-success': verificationStatus?.status === 'approved',
                                'bg-danger': verificationStatus?.status === 'rejected',
                                'bg-secondary': !verificationStatus || verificationStatus?.status === 'none'
                            }">
                                {{ verificationStatus?.status === 'pending' ? 'На проверке' : 
                                   verificationStatus?.status === 'approved' ? 'Верифицирован' : 
                                   verificationStatus?.status === 'rejected' ? 'Отклонено' : 
                                   'Не верифицирован' }}
                            </span>
                        </div>

                        <div v-if="verificationStatus?.status === 'rejected' && verificationStatus?.rejectionReason" class="alert alert-danger mb-3">
                            <strong>Причина отклонения:</strong> {{ verificationStatus.rejectionReason }}
                        </div>

                        <div v-if="!verificationStatus || verificationStatus?.status === 'none' || verificationStatus?.status === 'rejected'">
                            <div class="row g-3 mb-3">
                                <div class="col-12 col-md-4">
                                    <label class="form-label">Первая страница паспорта</label>
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        accept="image/*"
                                        @change="handleFileSelect('passportPage1', $event)"
                                        :disabled="uploadLoading"
                                    />
                                    <div v-if="passportPage1Preview" class="mt-2">
                                        <img :src="passportPage1Preview" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
                                    </div>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label">Вторая страница паспорта</label>
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        accept="image/*"
                                        @change="handleFileSelect('passportPage2', $event)"
                                        :disabled="uploadLoading"
                                    />
                                    <div v-if="passportPage2Preview" class="mt-2">
                                        <img :src="passportPage2Preview" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
                                    </div>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label">Селфи с паспортом</label>
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        accept="image/*"
                                        @change="handleFileSelect('selfieWithPassport', $event)"
                                        :disabled="uploadLoading"
                                    />
                                    <div v-if="selfieWithPassportPreview" class="mt-2">
                                        <img :src="selfieWithPassportPreview" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
                                    </div>
                                </div>
                            </div>
                            <button 
                                @click="uploadVerificationDocuments" 
                                class="btn btn-primary"
                                :disabled="uploadLoading || !passportPage1 || !passportPage2 || !selfieWithPassport"
                            >
                                <span v-if="uploadLoading" class="spinner-border spinner-border-sm me-2"></span>
                                Загрузить документы
                            </button>
                        </div>

                        <div v-else-if="verificationStatus?.status === 'pending'" class="alert alert-warning">
                            Ваши документы находятся на проверке. Ожидайте решения модератора.
                        </div>

                        <div v-else-if="verificationStatus?.status === 'approved'" class="alert alert-success">
                            Ваша верификация успешно пройдена.
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-none mb-3 mb-lg-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0">Адреса доставки</h5>
                        <button class="btn btn-primary btn-sm" @click="openAddressModal()">
                            Добавить адрес
                        </button>
                    </div>

                    <div v-if="addressesLoading" class="text-center py-3">
                        <div class="spinner-border spinner-border-sm"></div>
                    </div>

                    <div v-else-if="addresses.length === 0" class="text-center py-3 text-muted">
                        <p class="mb-0">Адресов пока нет</p>
                    </div>

                    <div v-else class="row g-3">
                        <div 
                            v-for="address in addresses" 
                            :key="address.id"
                            class="col-12 col-md-6"
                        >
                            <div class="card border" :class="{ 'border-primary': address.isDefault }">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 class="mb-1">
                                                {{ address.name }}
                                                <span v-if="address.isDefault" class="badge bg-primary ms-2">По умолчанию</span>
                                            </h6>
                                            <p class="mb-1 small text-muted">{{ address.phone }}</p>
                                            <p class="mb-0 small">{{ address.city }}, {{ address.address }}</p>
                                        </div>
                                        <div class="btn-group btn-group-sm">
                                            <button 
                                                class="btn btn-outline-secondary"
                                                @click="openAddressModal(address)"
                                            >
                                                <i class="bi bi-pencil"></i>
                                            </button>
                                            <button 
                                                class="btn btn-outline-danger"
                                                @click="deleteAddress(address.id)"
                                            >
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showAddressModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ editingAddress ? 'Редактировать адрес' : 'Добавить адрес' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeAddressModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ФИО получателя *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="addressForm.name"
                                placeholder="Иванов Иван Иванович"
                            >
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Телефон *</label>
                            <input 
                                type="tel" 
                                class="form-control" 
                                v-model="addressForm.phone"
                                placeholder="+7 (999) 123-45-67"
                            >
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Город *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="addressForm.city"
                                placeholder="Москва"
                            >
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Адрес *</label>
                            <textarea 
                                class="form-control" 
                                v-model="addressForm.address"
                                rows="2"
                                placeholder="ул. Примерная, д. 1, кв. 1"
                            ></textarea>
                        </div>
                        <div class="mb-0">
                            <div class="form-check">
                                <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    v-model="addressForm.isDefault"
                                    id="addressDefault"
                                >
                                <label class="form-check-label" for="addressDefault">
                                    Использовать по умолчанию
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeAddressModal">Отмена</button>
                        <button type="button" class="btn btn-primary" @click="saveAddress">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
</template>
