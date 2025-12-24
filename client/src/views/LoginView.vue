<script setup>
import { ref } from "vue";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useRouter } from "vue-router";
import { saveSessionToken, isNativePlatform } from "@/utils/sessionStorage";

const router = useRouter();
const { signIn, signUp, useSession } = authClient;

const loginSchema = z.object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email адрес"),
    password: z.string().min(1, "Пароль обязателен").min(8, "Пароль должен содержать не менее 8 символов")
});

const loginData = ref({
    email: "",
    password: "",
});

const validationErrors = ref({});
const serverError = ref("");
const isEmailValid = ref(true);
const isPasswordValid = ref(true);
const passwordVisible = ref(false);
const isLoading = ref(false);

async function login() {
    validationErrors.value = {};
    serverError.value = "";

    const result = loginSchema.safeParse(loginData.value);

    if (!result.success && result.error && result.error.errors) {
        result.error.errors.forEach((err) => {
            validationErrors.value[err.path[0]] = err.message;
        });

        isEmailValid.value = !result.error.errors.some(err => err.path[0] === 'email');
        isPasswordValid.value = !result.error.errors.some(err => err.path[0] === 'password');

        return;
    }

    isEmailValid.value = true;
    isPasswordValid.value = true;

    const { data, error } = await signIn.email(
        {
            email: loginData.value.email,
            password: loginData.value.password,
            callbackURL: "/dashboard",
        },
        {
            onRequest: (ctx) => {
                isLoading.value = true;
            },
            onSuccess: (ctx) => {
                isLoading.value = false;
                if (isNativePlatform() && ctx.data?.token) {
                    saveSessionToken(ctx.data.token);
                    console.log("[Auth] Token saved for mobile app");
                }
            },
            onError: (ctx) => {
                serverError.value = ctx.error.message;
                isLoading.value = false;
            },
        },
    );
}

function validateField(fieldName) {
    const fieldSchema = loginSchema.shape[fieldName];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(loginData.value[fieldName]);
    if (!result.success && result.error && result.error.errors && result.error.errors.length > 0) {
        validationErrors.value[fieldName] = result.error.errors[0].message;

        if (fieldName === 'email') isEmailValid.value = false;
        if (fieldName === 'password') isPasswordValid.value = false;
    } else {
        delete validationErrors.value[fieldName];

        if (fieldName === 'email') isEmailValid.value = true;
        if (fieldName === 'password') isPasswordValid.value = true;
    }
}

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
        passwordVisible.value = true;
    } else {
        field.type = 'password';
        passwordVisible.value = false;
    }
}
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
                                            <h3 class="mb-2">Вход</h3>
                                            <p class="text-muted mb-0">Войдите в свой аккаунт</p>
                                        </div>

                                        <div v-if="serverError" class="alert alert-danger mb-3">
                                            <i class="bi bi-exclamation-circle me-2"></i>
                                            {{ serverError }}
                                        </div>

                                        <form @submit.prevent="login">
                                            <div class="mb-3">
                                                <label for="emailadd" class="form-label">Email</label>
                                                <input 
                                                    v-model="loginData.email" 
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

                                            <div class="mb-4">
                                                <label for="passwd" class="form-label">Пароль</label>
                                                <div class="input-group">
                                                    <input 
                                                        v-model="loginData.password" 
                                                        type="password" 
                                                        class="form-control"
                                                        :class="{ 'is-invalid': !isPasswordValid }" 
                                                        id="passwd"
                                                        placeholder="Введите пароль" 
                                                        @blur="validateField('password')" 
                                                    />
                                                    <button
                                                        type="button"
                                                        class="btn btn-outline-secondary"
                                                        @click="togglePasswordVisibility('passwd')">
                                                        <i class="bi" :class="passwordVisible ? 'bi-eye-slash' : 'bi-eye'"></i>
                                                    </button>
                                                </div>
                                                <div v-if="validationErrors.password" class="invalid-feedback d-block">
                                                    {{ validationErrors.password }}
                                                </div>
                                            </div>

                                            <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
                                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                                Войти
                                            </button>
                                        </form>

                                        <div class="text-center">
                                            <p class="mb-0">
                                                Нет аккаунта?
                                                <RouterLink to="/signup" class="text-decoration-none">Зарегистрироваться</RouterLink>
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
