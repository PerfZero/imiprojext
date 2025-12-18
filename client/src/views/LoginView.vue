<script setup>
import { ref } from "vue";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useRouter } from "vue-router";

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

// Validation errors
const validationErrors = ref({});

// Server errors
const serverError = ref("");

// Validation states for UI
const isEmailValid = ref(true);
const isPasswordValid = ref(true);
const isLoading = ref(false);

async function login() {
    // Clear previous errors
    validationErrors.value = {};
    serverError.value = "";

    // Validate form data
    const result = loginSchema.safeParse(loginData.value);

    if (!result.success && result.error && result.error.errors) {
        // Extract validation errors
        result.error.errors.forEach((err) => {
            validationErrors.value[err.path[0]] = err.message;
        });

        // Update UI validation states
        isEmailValid.value = !result.error.errors.some(err => err.path[0] === 'email');
        isPasswordValid.value = !result.error.errors.some(err => err.path[0] === 'password');

        return;
    }

    // If validation passes, clear validation states
    isEmailValid.value = true;
    isPasswordValid.value = true;

    console.log("loginData", loginData.value);
    const { data, error } = await signIn.email(
        {
            email: loginData.value.email, // user email address
            password: loginData.value.password, // user password
            callbackURL: "/dashboard", // A URL to redirect to after successful login
        },
        {
            onRequest: (ctx) => {
                //show loading
                isLoading.value = true;
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard
                isLoading.value = false;
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
    const fieldSchema = loginSchema.shape[fieldName];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(loginData.value[fieldName]);
    if (!result.success && result.error && result.error.errors && result.error.errors.length > 0) {
        validationErrors.value[fieldName] = result.error.errors[0].message;

        // Update UI validation state
        if (fieldName === 'email') isEmailValid.value = false;
        if (fieldName === 'password') isPasswordValid.value = false;
    } else {
        // Clear error if validation passes
        delete validationErrors.value[fieldName];

        // Update UI validation state
        if (fieldName === 'email') isEmailValid.value = true;
        if (fieldName === 'password') isPasswordValid.value = true;
    }
}

// Function to toggle password visibility
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}

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
                                        Вход
                                    </h1>
                                    <p class="opacity-75">В личный кабинет</p>
                                </div>

                                <!-- Server error message -->
                                <div v-if="serverError" class="alert alert-danger mb-3">
                                    {{ serverError }}
                                </div>

                                <div class="form-floating mb-3">
                                    <input v-model="loginData.email" type="email" class="form-control"
                                        :class="{ 'is-invalid': !isEmailValid }" id="emailadd"
                                        placeholder="Enter email address" @blur="validateField('email')" />
                                    <label for="emailadd">Email</label>
                                    <div v-if="validationErrors.email" class="invalid-feedback">
                                        {{ validationErrors.email }}
                                    </div>
                                </div>
                                <div class="position-relative">
                                    <div class="form-floating mb-3">
                                        <input v-model="loginData.password" type="password" class="form-control"
                                            :class="{ 'is-invalid': !isPasswordValid }" id="passwd"
                                            placeholder="Enter your password" @blur="validateField('password')" />
                                        <label for="passwd">Пароль</label>
                                        <div v-if="validationErrors.password" class="invalid-feedback">
                                            {{ validationErrors.password }}
                                        </div>
                                    </div>
                                    <button
                                        class="btn btn-square btn-link text-theme-1 position-absolute end-0 top-0 mt-2 me-2"
                                        @click="togglePasswordVisibility('passwd')">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                                <!-- <div class="row gx-3 align-items-center mb-3">

                                    <div class="col-auto">
                                        <a href="/forgot-password" class="btn btn-link ">Забыли пароль?</a>
                                    </div>
                                </div> -->
                                <div class="row gx-3 align-items-center mb-3">
                                    <div class="col">
                                        <button class="btn btn-lg btn-accent w-100" @click="login"
                                            :disabled="isLoading">
                                            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                            Войти
                                        </button>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <p class="mb-0">
                                        Нет аккаунта?
                                        <RouterLink to="/signup" class="text-primary text-decoration-none fw-bold">
                                            Зарегистрироваться
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
