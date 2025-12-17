<script setup>
defineProps({
    title: String,
    value: [String, Number],
    icon: String,
    color: {
        type: String,
        default: "primary",
    },
    loading: Boolean,
});
</script>

<template>
    <div class="card border-0 shadow-sm h-100">
        <div class="card-body">
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                    <div
                        class="avatar avatar-50 rounded-circle d-flex align-items-center justify-content-center"
                        :class="`bg-${color}-subtle text-${color}`"
                    >
                        <i :class="icon" class="fs-4"></i>
                    </div>
                </div>
                <div class="flex-grow-1 ms-3">
                    <p class="text-muted small mb-1">{{ title }}</p>
                    <h4 class="mb-0" v-if="!loading">{{ value }}</h4>
                    <div v-else class="placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
