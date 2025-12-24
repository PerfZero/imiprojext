<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useRoute, useRouter } from "vue-router";
import IMask from "imask";

const { signIn, signUp, useSession } = authClient;
const route = useRoute();
const router = useRouter();
const signupSchema = z.object({
    firstName: z.string().min(1, "Имя обязательно").min(2, "Имя должно содержать не менее 2 символов"),
    lastName: z.string().min(1, "Фамилия обязательна").min(2, "Фамилия должна содержать не менее 2 символов"),
    email: z.string().min(1, "Email обязателен").email("Некорректный email адрес"),
    phone: z.string()
        .min(1, "Телефон обязателен")
        .refine((val) => {
            const digits = val.replace(/\D/g, '');
            return digits.length >= 10 && digits.length <= 15;
        }, "Телефон должен содержать от 10 до 15 цифр"),
    password: z.string()
        .min(1, "Пароль обязателен")
        .min(8, "Пароль должен содержать не менее 8 символов")
        .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
        .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
        .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    password2: z.string().min(1, "Подтверждение пароля обязательно"),
    referrerCode: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: "Необходимо согласиться с условиями использования",
    })
}).refine((data) => data.password === data.password2, {
    message: "Пароли не совпадают",
    path: ["password2"],
});

const urlReferrerCode = route.path.startsWith('/ref/') ? route.path.split('/')[2] : '';

const signupData = ref({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    referrerCode: urlReferrerCode || "",
    agreeToTerms: false,
});

const validationErrors = ref({});
const serverError = ref("");
const isFirstNameValid = ref(true);
const isLastNameValid = ref(true);
const isEmailValid = ref(true);
const isPhoneValid = ref(true);
const isPasswordValid = ref(true);
const isPassword2Valid = ref(true);
const passwordVisible1 = ref(false);
const passwordVisible2 = ref(false);
const isLoading = ref(false);
const currentStep = ref(1);
const totalSteps = 4;

async function signup() {
    validationErrors.value = {};
    serverError.value = "";

    const result = signupSchema.safeParse(signupData.value);

    if (!result.success && result.error && result.error.errors) {
        result.error.errors.forEach((err) => {
            validationErrors.value[err.path[0]] = err.message;
        });

        isFirstNameValid.value = !result.error.errors.some(err => err.path[0] === 'firstName');
        isLastNameValid.value = !result.error.errors.some(err => err.path[0] === 'lastName');
        isEmailValid.value = !result.error.errors.some(err => err.path[0] === 'email');
        isPhoneValid.value = !result.error.errors.some(err => err.path[0] === 'phone');
        isPasswordValid.value = !result.error.errors.some(err => err.path[0] === 'password');
        isPassword2Valid.value = !result.error.errors.some(err => err.path[0] === 'password2');

        if (result.error.errors.some(err => err.path[0] === 'agreeToTerms')) {
            validationErrors.value.agreeToTerms = result.error.errors.find(err => err.path[0] === 'agreeToTerms')?.message;
        }

        return;
    }

    isFirstNameValid.value = true;
    isLastNameValid.value = true;
    isEmailValid.value = true;
    isPhoneValid.value = true;
    isPasswordValid.value = true;
    isPassword2Valid.value = true;

    const phoneDigits = signupData.value.phone.replace(/\D/g, '');
    const formattedPhone = phoneDigits.startsWith('7') ? `+${phoneDigits}` : `+7${phoneDigits}`;
    const fullName = `${signupData.value.firstName.trim()} ${signupData.value.lastName.trim()}`;
    
    const { data, error } = await signUp.email(
        {
            email: signupData.value.email,
            phone: formattedPhone,
            name: fullName,
            password: signupData.value.password,
            callbackURL: "/dashboard",
            referrerCode: signupData.value.referrerCode,
        },
        {
            onRequest: (ctx) => {
                isLoading.value = true;
            },
            onSuccess: (ctx) => {
                isLoading.value = false;
                router.push('/dashboard');
            },
            onError: (ctx) => {
                serverError.value = ctx.error.message;
                isLoading.value = false;
            },
        },
    );
}

function validateField(fieldName) {
    const fieldSchema = signupSchema.shape[fieldName];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(signupData.value[fieldName]);
    if (!result.success && result.error && result.error.errors && result.error.errors.length > 0) {
        validationErrors.value[fieldName] = result.error.errors[0].message;

        if (fieldName === 'firstName') isFirstNameValid.value = false;
        if (fieldName === 'lastName') isLastNameValid.value = false;
        if (fieldName === 'email') isEmailValid.value = false;
        if (fieldName === 'phone') isPhoneValid.value = false;
        if (fieldName === 'password') isPasswordValid.value = false;
        if (fieldName === 'password2') isPassword2Valid.value = false;
    } else {
        delete validationErrors.value[fieldName];

        if (fieldName === 'firstName') isFirstNameValid.value = true;
        if (fieldName === 'lastName') isLastNameValid.value = true;
        if (fieldName === 'email') isEmailValid.value = true;
        if (fieldName === 'phone') isPhoneValid.value = true;
        if (fieldName === 'password') isPasswordValid.value = true;
        if (fieldName === 'password2') isPassword2Valid.value = true;
    }
}

function validateStep(step) {
    if (step === 1) {
        validateField('firstName');
        validateField('lastName');
        return isFirstNameValid.value && isLastNameValid.value;
    }
    if (step === 2) {
        validateField('email');
        validateField('phone');
        return isEmailValid.value && isPhoneValid.value;
    }
    if (step === 3) {
        validateField('password');
        validateField('password2');
        return isPasswordValid.value && isPassword2Valid.value;
    }
    return true;
}

function nextStep() {
    if (validateStep(currentStep.value)) {
        if (currentStep.value < totalSteps) {
            currentStep.value++;
        }
    }
}

function prevStep() {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
}

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
        if (fieldId === 'checkstrength') passwordVisible1.value = true;
        if (fieldId === 'passwd') passwordVisible2.value = true;
    } else {
        field.type = 'password';
        if (fieldId === 'checkstrength') passwordVisible1.value = false;
        if (fieldId === 'passwd') passwordVisible2.value = false;
    }
}

function openTermsModal() {
    window.open('/terms', '_blank');
}

let phoneMask = null;

onMounted(() => {
    const phoneInput = document.getElementById('phonen');
    if (phoneInput) {
        phoneMask = IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00',
            lazy: false,
        });
    }
});

onUnmounted(() => {
    if (phoneMask) {
        phoneMask.destroy();
    }
});
</script>

<template>
    <main class="adminuiux-content">
        <div class="container">
            <div class="row justify-content-center align-items-center" style="min-height: calc(100vh - 200px);">
                <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div class="card shadow">
                        <div class="card-header bg-white border-bottom">
                            <div class="d-flex align-items-center justify-content-between">
                                <button @click="router.push('/')" class="btn btn-sm btn-link text-muted text-decoration-none p-0">
                                    Назад
                                </button>
                                <h5 class="mb-0 fw-bold">Регистрация</h5>
                                <div style="width: 40px;"></div>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <div class="mb-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div 
                                        v-for="step in totalSteps" 
                                        :key="step"
                                        class="d-flex align-items-center"
                                        :class="{ 'flex-grow-1': step < totalSteps }"
                                    >
                                        <div class="d-flex flex-column align-items-center flex-grow-1">
                                            <div 
                                                class="rounded-circle d-flex align-items-center justify-content-center mb-2"
                                                :class="currentStep >= step ? 'bg-primary text-white' : 'bg-secondary text-white'"
                                                style="width: 40px; height: 40px; font-weight: bold;"
                                            >
                                                {{ step }}
                                            </div>
                                            <small class="text-muted text-center" style="font-size: 0.75rem;">
                                                <span v-if="step === 1">Личные данные</span>
                                                <span v-else-if="step === 2">Контакты</span>
                                                <span v-else-if="step === 3">Пароль</span>
                                                <span v-else-if="step === 4">Завершение</span>
                                            </small>
                                        </div>
                                        <div 
                                            v-if="step < totalSteps"
                                            class="flex-grow-1 mx-2"
                                            style="height: 2px;"
                                            :class="currentStep > step ? 'bg-primary' : 'bg-secondary'"
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="serverError" class="alert alert-danger alert-dismissible fade show">
                                {{ serverError }}
                                <button type="button" class="btn-close" @click="serverError = ''"></button>
                            </div>

                            <form @submit.prevent="currentStep === totalSteps ? signup() : nextStep()">
                                <div v-if="currentStep === 1" class="step-content">
                                    <h6 class="mb-3">Шаг 1: Личные данные</h6>
                                    <div class="mb-3">
                                        <label for="firstName" class="form-label">Имя *</label>
                                        <input 
                                            v-model="signupData.firstName" 
                                            type="text" 
                                            class="form-control"
                                            :class="{ 'is-invalid': !isFirstNameValid }" 
                                            id="firstName"
                                            placeholder="Иван" 
                                            @blur="validateField('firstName')" 
                                        />
                                        <div v-if="validationErrors.firstName" class="invalid-feedback d-block">
                                            {{ validationErrors.firstName }}
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="lastName" class="form-label">Фамилия *</label>
                                        <input 
                                            v-model="signupData.lastName" 
                                            type="text" 
                                            class="form-control"
                                            :class="{ 'is-invalid': !isLastNameValid }" 
                                            id="lastName"
                                            placeholder="Иванов" 
                                            @blur="validateField('lastName')" 
                                        />
                                        <div v-if="validationErrors.lastName" class="invalid-feedback d-block">
                                            {{ validationErrors.lastName }}
                                        </div>
                                    </div>
                                </div>

                                <div v-if="currentStep === 2" class="step-content">
                                    <h6 class="mb-3">Шаг 2: Контактная информация</h6>
                                    <div class="mb-3">
                                        <label for="emailadd" class="form-label">Email *</label>
                                        <input 
                                            v-model="signupData.email" 
                                            type="email" 
                                            class="form-control"
                                            :class="{ 'is-invalid': !isEmailValid }" 
                                            id="emailadd"
                                            placeholder="example@mail.com" 
                                            @blur="validateField('email')" 
                                        />
                                        <div v-if="validationErrors.email" class="invalid-feedback d-block">
                                            {{ validationErrors.email }}
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="phonen" class="form-label">Телефон *</label>
                                        <input 
                                            v-model="signupData.phone" 
                                            type="tel" 
                                            class="form-control"
                                            :class="{ 'is-invalid': !isPhoneValid }" 
                                            id="phonen"
                                            placeholder="+7 (999) 123-45-67" 
                                            @blur="validateField('phone')" 
                                        />
                                        <div v-if="validationErrors.phone" class="invalid-feedback d-block">
                                            {{ validationErrors.phone }}
                                        </div>
                                    </div>
                                </div>

                                <div v-if="currentStep === 3" class="step-content">
                                    <h6 class="mb-3">Шаг 3: Создание пароля</h6>
                                    <div class="mb-3">
                                        <label for="checkstrength" class="form-label">Пароль *</label>
                                        <div class="input-group">
                                            <input 
                                                v-model="signupData.password" 
                                                :type="passwordVisible1 ? 'text' : 'password'" 
                                                class="form-control"
                                                :class="{ 'is-invalid': !isPasswordValid }" 
                                                id="checkstrength"
                                                placeholder="Минимум 8 символов" 
                                                @blur="validateField('password')" 
                                            />
                                            <button
                                                type="button"
                                                class="btn btn-outline-secondary"
                                                @click="togglePasswordVisibility('checkstrength')">
                                                <i class="bi" :class="passwordVisible1 ? 'bi-eye-slash' : 'bi-eye'"></i>
                                            </button>
                                        </div>
                                        <div v-if="validationErrors.password" class="invalid-feedback d-block">
                                            {{ validationErrors.password }}
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="passwd" class="form-label">Повторите пароль *</label>
                                        <div class="input-group">
                                            <input 
                                                v-model="signupData.password2" 
                                                :type="passwordVisible2 ? 'text' : 'password'" 
                                                class="form-control"
                                                :class="{ 'is-invalid': !isPassword2Valid }" 
                                                id="passwd"
                                                placeholder="Повторите пароль" 
                                                @blur="validateField('password2')" 
                                            />
                                            <button
                                                type="button"
                                                class="btn btn-outline-secondary"
                                                @click="togglePasswordVisibility('passwd')">
                                                <i class="bi" :class="passwordVisible2 ? 'bi-eye-slash' : 'bi-eye'"></i>
                                            </button>
                                        </div>
                                        <div v-if="validationErrors.password2" class="invalid-feedback d-block">
                                            {{ validationErrors.password2 }}
                                        </div>
                                    </div>
                                </div>

                                <div v-if="currentStep === 4" class="step-content">
                                    <h6 class="mb-3">Шаг 4: Завершение регистрации</h6>
                                    <div class="mb-3">
                                        <label for="referrerCode" class="form-label">
                                            Код пригласившего
                                            <span class="text-muted small">(необязательно)</span>
                                        </label>
                                        <input 
                                            v-model="signupData.referrerCode" 
                                            type="text" 
                                            class="form-control"
                                            id="referrerCode" 
                                            placeholder="Введите код" 
                                        />
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-check">
                                            <input 
                                                v-model="signupData.agreeToTerms" 
                                                class="form-check-input" 
                                                type="checkbox" 
                                                id="agreeToTerms"
                                                :class="{ 'is-invalid': validationErrors.agreeToTerms }"
                                            />
                                            <label class="form-check-label" for="agreeToTerms">
                                                Я согласен с 
                                                <a href="#" class="text-decoration-none" @click.prevent="openTermsModal">договором оферты</a>
                                            </label>
                                        </div>
                                        <div v-if="validationErrors.agreeToTerms" class="invalid-feedback d-block">
                                            {{ validationErrors.agreeToTerms }}
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between mt-4">
                                    <button 
                                        type="button" 
                                        class="btn btn-outline-secondary"
                                        @click="prevStep"
                                        :disabled="currentStep === 1"
                                    >
                                        Назад
                                    </button>
                                    <button 
                                        v-if="currentStep < totalSteps"
                                        type="button" 
                                        class="btn btn-primary"
                                        @click="nextStep"
                                    >
                                        Далее
                                    </button>
                                    <button 
                                        v-else
                                        type="submit" 
                                        class="btn btn-primary"
                                        :disabled="isLoading"
                                    >
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        Зарегистрироваться
                                    </button>
                                </div>
                            </form>

                            <div class="text-center mt-3">
                                <p class="mb-0 text-muted">
                                    Уже зарегистрированы?
                                    <RouterLink to="/login" class="text-decoration-none fw-medium">Войти</RouterLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

