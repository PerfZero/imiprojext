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
    referrerCode: z.string().optional()
}).refine((data) => data.password === data.password2, {
    message: "Пароли не совпадают",
    path: ["password2"],
});

// Extract referrerCode from URL if present
const urlReferrerCode = route.path.startsWith('/ref/') ? route.path.split('/')[2] : '';

const signupData = ref({
    email: "",
    phone: "",
    password: "",
    password2: "",
    referrerCode: urlReferrerCode || "",
});



// Validation errors
const validationErrors = ref({});

// Server errors
const serverError = ref("");

// Validation states for UI
const isEmailValid = ref(true);
const isPhoneValid = ref(true);
const isPasswordValid = ref(true);
const isPassword2Valid = ref(true);

const isLoading = ref(false);
async function signup() {
    // Clear previous errors
    validationErrors.value = {};
    serverError.value = "";

    // Validate form data
    const result = signupSchema.safeParse(signupData.value);

    if (!result.success && result.error && result.error.errors) {
        // Extract validation errors
        result.error.errors.forEach((err) => {
            validationErrors.value[err.path[0]] = err.message;
        });

        // Update UI validation states
        isEmailValid.value = !result.error.errors.some(err => err.path[0] === 'email');
        isPhoneValid.value = !result.error.errors.some(err => err.path[0] === 'phone');
        isPasswordValid.value = !result.error.errors.some(err => err.path[0] === 'password');
        isPassword2Valid.value = !result.error.errors.some(err => err.path[0] === 'password2');

        return;
    }

    // If validation passes, clear validation states
    isEmailValid.value = true;
    isPhoneValid.value = true;
    isPasswordValid.value = true;
    isPassword2Valid.value = true;

    const phoneDigits = signupData.value.phone.replace(/\D/g, '');
    const formattedPhone = phoneDigits.startsWith('7') ? `+${phoneDigits}` : `+7${phoneDigits}`;
    
    console.log("signupData", signupData.value);
    const { data, error } = await signUp.email(
        {
            email: signupData.value.email,
            phone: formattedPhone,
            name: "-",
            password: signupData.value.password, // user password -> min 8 characters by default
            callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
            referrerCode: signupData.value.referrerCode, // optional referrer code
        },
        {
            onRequest: (ctx) => {
                //show loading
                isLoading.value = true;
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
                isLoading.value = false;
                router.push('/dashboard'); // Navigate to the home page
            },
            onError: (ctx) => {
                // display the error message
                serverError.value = ctx.error.message;
                isLoading.value = false;
            },
        },
    );
}

// Function to validate individual fields
function validateField(fieldName) {
    const fieldSchema = signupSchema.shape[fieldName];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(signupData.value[fieldName]);
    if (!result.success && result.error && result.error.errors && result.error.errors.length > 0) {
        validationErrors.value[fieldName] = result.error.errors[0].message;

        // Update UI validation state
        if (fieldName === 'email') isEmailValid.value = false;
        if (fieldName === 'phone') isPhoneValid.value = false;
        if (fieldName === 'password') isPasswordValid.value = false;
        if (fieldName === 'password2') isPassword2Valid.value = false;
    } else {
        // Clear error if validation passes
        delete validationErrors.value[fieldName];

        // Update UI validation state
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
    } else {
        field.type = 'password';
    }
}

let phoneMask = null;

onMounted(() => {
    const phoneInput = document.getElementById('phonen');
    if (phoneInput) {
        phoneMask = IMask(phoneInput, {
            mask: '+{7}(000)000-00-00',
            lazy: false,
            placeholderChar: '_'
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
        <!--Page body-->
        <div class="container-fluid">
            <div class="row justify-content-center minheight-dynamic" style="
                    --mih-dynamic: calc(
                        100vh - 145px - env(safe-area-inset-bottom) -
                            env(safe-area-inset-top)
                    );
                ">
                <div class="col-12 col-md-8 col-xl-6">
                    <div class="h-100 py-3 px-md-3">
                        <div class="row h-100 align-items-center justify-content-center">
                            <div class="col-12 col-sm-8 col-md-11 col-xl-11 col-xxl-10 login-box">
                                <div class="text-center mb-4">
                                    <button @click="router.push('/')" class="btn btn-link text-start mb-3 p-0">
                                        <i class="bi bi-arrow-left me-2"></i>Назад
                                    </button>
                                    <h1 class="display-4 fw-bold mb-1">
                                        Регистрация
                                    </h1>
                                    <p class="opacity-75">
                                        Создайте аккаунт для начала работы
                                    </p>
                                </div>

                                <!-- Server error message -->
                                <div v-if="serverError" class="alert alert-danger mb-3">
                                    {{ serverError }}
                                </div>

                                <div class="form-floating mb-3">
                                    <input v-model="signupData.email" type="email" class="form-control"
                                        :class="{ 'is-invalid': !isEmailValid }" id="emailadd"
                                        placeholder="Enter email address" @blur="validateField('email')" />
                                    <label for="emailadd">Email</label>
                                    <div v-if="validationErrors.email" class="invalid-feedback">
                                        {{ validationErrors.email }}
                                    </div>
                                </div>
                                <div class="form-floating mb-3">
                                    <input v-model="signupData.phone" type="tel" class="form-control"
                                        :class="{ 'is-invalid': !isPhoneValid }" id="phonen"
                                        placeholder="+7 (___) ___-__-__" @blur="validateField('phone')" />
                                    <label for="phonen">Телефон</label>
                                    <div v-if="validationErrors.phone" class="invalid-feedback">
                                        {{ validationErrors.phone }}
                                    </div>
                                    <small class="text-muted">Формат: +7 (___) ___-__-__</small>
                                </div>
                                <div class="position-relative">
                                    <div class="form-floating mb-2 mb-lg-3">
                                        <input v-model="signupData.password" type="password" class="form-control"
                                            :class="{ 'is-invalid': !isPasswordValid }" id="checkstrength"
                                            placeholder="Enter your password" @blur="validateField('password')" />
                                        <label for="checkstrength">Пароль</label>
                                        <div v-if="validationErrors.password" class="invalid-feedback">
                                            {{ validationErrors.password }}
                                        </div>
                                    </div>
                                    <button
                                        class="btn btn-square btn-link text-theme-1 position-absolute end-0 top-0 mt-2 me-2"
                                        @click="togglePasswordVisibility('checkstrength')">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>

                                <div class="position-relative">
                                    <div class="form-floating mb-3">
                                        <input v-model="signupData.password2" type="password" class="form-control"
                                            :class="{ 'is-invalid': !isPassword2Valid }" id="passwd"
                                            placeholder="Confirm your password" @blur="validateField('password2')" />
                                        <label for="passwd">Повторите пароль</label>
                                        <div v-if="validationErrors.password2" class="invalid-feedback">
                                            {{ validationErrors.password2 }}
                                        </div>
                                    </div>
                                    <button
                                        class="btn btn-square btn-link text-theme-1 position-absolute end-0 top-0 mt-2 me-2"
                                        @click="togglePasswordVisibility('passwd')">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>

                                <div class="form-floating mb-3">
                                    <input v-model="signupData.referrerCode" type="text" class="form-control"
                                        id="referrerCode" placeholder="Введите код пригласившего (необязательно)" />
                                    <label for="referrerCode">Код пригласившего (необязательно)</label>
                                </div>

                                <button class="btn btn-lg btn-accent w-100 mb-3" @click="signup" :disabled="isLoading">
                                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                    Зарегистрироваться
                                </button>
                                <div class="text-center">
                                    <p class="mb-0">
                                        Уже зарегистрированы?
                                        <RouterLink to="/login" class="text-primary text-decoration-none fw-bold">
                                            Войти
                                        </RouterLink>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
