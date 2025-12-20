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
    email: "",
    phone: "",
    password: "",
    password2: "",
    referrerCode: urlReferrerCode || "",
    agreeToTerms: false,
});

const validationErrors = ref({});
const serverError = ref("");
const isEmailValid = ref(true);
const isPhoneValid = ref(true);
const isPasswordValid = ref(true);
const isPassword2Valid = ref(true);
const passwordVisible1 = ref(false);
const passwordVisible2 = ref(false);
const isLoading = ref(false);

async function signup() {
    validationErrors.value = {};
    serverError.value = "";

    const result = signupSchema.safeParse(signupData.value);

    if (!result.success && result.error && result.error.errors) {
        result.error.errors.forEach((err) => {
            validationErrors.value[err.path[0]] = err.message;
        });

        isEmailValid.value = !result.error.errors.some(err => err.path[0] === 'email');
        isPhoneValid.value = !result.error.errors.some(err => err.path[0] === 'phone');
        isPasswordValid.value = !result.error.errors.some(err => err.path[0] === 'password');
        isPassword2Valid.value = !result.error.errors.some(err => err.path[0] === 'password2');

        if (result.error.errors.some(err => err.path[0] === 'agreeToTerms')) {
            validationErrors.value.agreeToTerms = result.error.errors.find(err => err.path[0] === 'agreeToTerms')?.message;
        }

        return;
    }

    isEmailValid.value = true;
    isPhoneValid.value = true;
    isPasswordValid.value = true;
    isPassword2Valid.value = true;

    const phoneDigits = signupData.value.phone.replace(/\D/g, '');
    const formattedPhone = phoneDigits.startsWith('7') ? `+${phoneDigits}` : `+7${phoneDigits}`;
    
    const { data, error } = await signUp.email(
        {
            email: signupData.value.email,
            phone: formattedPhone,
            name: "-",
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

        if (fieldName === 'email') isEmailValid.value = false;
        if (fieldName === 'phone') isPhoneValid.value = false;
        if (fieldName === 'password') isPasswordValid.value = false;
        if (fieldName === 'password2') isPassword2Valid.value = false;
    } else {
        delete validationErrors.value[fieldName];

        if (fieldName === 'email') isEmailValid.value = true;
        if (fieldName === 'phone') isPhoneValid.value = true;
        if (fieldName === 'password') isPasswordValid.value = true;
        if (fieldName === 'password2') isPassword2Valid.value = true;
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
        <div class="container-fluid">
            <div class="row justify-content-center minheight-dynamic" style="
                    --mih-dynamic: calc(
                        100vh - 145px - env(safe-area-inset-bottom) -
                            env(safe-area-inset-top)
                    );
                ">
                <div class="col-12 col-md-8 col-xl-5">
                    <div class="h-100 py-4 px-3">
                        <div class="row h-100 align-items-center justify-content-center">
                            <div class="col-12">
                                <div class="card border shadow-sm">
                                    <div class="card-body p-4 p-md-5">
                                        <div class="text-center mb-4">
                                            <button @click="router.push('/')" class="btn btn-link p-0 mb-3 text-start">
                                                <i class="bi bi-arrow-left me-2"></i>Назад
                                            </button>
                                            <h3 class="mb-2">Регистрация</h3>
                                            <p class="text-muted mb-0">Создайте аккаунт для начала работы</p>
                                        </div>

                                        <div v-if="serverError" class="alert alert-danger mb-3">
                                            <i class="bi bi-exclamation-circle me-2"></i>
                                            {{ serverError }}
                                        </div>

                                        <form @submit.prevent="signup">
                                            <div class="mb-3">
                                                <label for="emailadd" class="form-label">Email</label>
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
                                                <label for="phonen" class="form-label">Телефон</label>
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

                                            <div class="mb-3">
                                                <label for="checkstrength" class="form-label">Пароль</label>
                                                <div class="input-group">
                                                    <input 
                                                        v-model="signupData.password" 
                                                        type="password" 
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
                                                <label for="passwd" class="form-label">Повторите пароль</label>
                                                <div class="input-group">
                                                    <input 
                                                        v-model="signupData.password2" 
                                                        type="password" 
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

                                            <div class="mb-3">
                                                <label for="referrerCode" class="form-label">Код пригласившего <span class="text-muted">(необязательно)</span></label>
                                                <input 
                                                    v-model="signupData.referrerCode" 
                                                    type="text" 
                                                    class="form-control"
                                                    id="referrerCode" 
                                                    placeholder="Введите код" 
                                                />
                                            </div>

                                            <div class="mb-4">
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

                                            <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
                                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                                Зарегистрироваться
                                            </button>
                                        </form>

                                        <div class="text-center">
                                            <p class="mb-0">
                                                Уже зарегистрированы?
                                                <RouterLink to="/login" class="text-decoration-none">Войти</RouterLink>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
