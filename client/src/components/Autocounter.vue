<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    count: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        default: 500 // Duration of animation in milliseconds
    }
});

const currentCount = ref(0);
let animationId = null;

const animateCount = (start, end, duration) => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    const startTime = performance.now();

    const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 2);

        currentCount.value = Math.floor(start + (end - start) * easeOut);

        if (progress < 1) {
            animationId = requestAnimationFrame(updateCount);
        } else {
            currentCount.value = end;
        }
    };

    animationId = requestAnimationFrame(updateCount);
};

watch(() => props.count, (newVal, oldVal) => {
    if (oldVal !== undefined) {
        animateCount(oldVal, newVal, props.duration);
    } else {
        currentCount.value = newVal;
    }
}, { immediate: true });

onMounted(() => {
    currentCount.value = props.count;
});

// Clean up animation frame on component unmount
onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
</script>

<template>
    <span class="autocounter">{{ currentCount.toLocaleString() }}</span>
</template>

<style scoped>
.autocounter {
    display: inline-block;
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
}
</style>