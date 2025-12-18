<script setup lang="ts">
import { ref, computed } from 'vue';
import ReferralTreeNode from './ReferralTreeNode.vue';

const props = defineProps({
    tree: {
        type: Array,
        default: () => []
    }
});

const expandedNodes = ref<Record<string, boolean>>({});

const toggleNode = (nodeId: string) => {
    expandedNodes.value[nodeId] = !expandedNodes.value[nodeId];
};

const isExpanded = (nodeId: string) => {
    return expandedNodes.value[nodeId] || false;
};

const formatDate = (timestamp: any): string => {
    if (!timestamp) return "-";
    const dateValue = typeof timestamp === 'number' 
        ? (timestamp < 10000000000 ? timestamp * 1000 : timestamp)
        : timestamp;
    try {
        return new Date(dateValue).toLocaleDateString("ru-RU", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch {
        return "-";
    }
};

const countAllReferrals = (node: any): number => {
    let count = 1;
    if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => {
            count += countAllReferrals(child);
        });
    }
    return count;
};
</script>

<template>
    <div class="referral-tree">
        <div v-if="!tree || tree.length === 0" class="text-center text-muted py-5">
            <i class="bi bi-tree display-4 d-block mb-3"></i>
            <p>У вас пока нет приглашенных друзей</p>
            <p class="small">Поделитесь реферальной ссылкой, чтобы начать зарабатывать</p>
        </div>
        <div v-else>
            <ReferralTreeNode 
                v-for="node in tree" 
                :key="node.id" 
                :node="node" 
                :level="0"
                :expanded-nodes="expandedNodes"
                :is-expanded="isExpanded"
                @toggle="toggleNode"
                :format-date="formatDate"
                :count-all="countAllReferrals"
            />
        </div>
    </div>
</template>

<style scoped>
.referral-tree {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
