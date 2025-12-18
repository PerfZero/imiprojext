<script setup lang="ts">
import ReferralTreeNode from './ReferralTreeNode.vue';
import { computed } from 'vue';

const props = defineProps({
    node: {
        type: Object,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    expandedNodes: {
        type: Object,
        required: true
    },
    isExpanded: {
        type: Function,
        required: true
    },
    formatDate: {
        type: Function,
        required: true
    },
    countAll: {
        type: Function,
        required: true
    }
});

const emit = defineEmits(['toggle']);

const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
const expanded = computed(() => props.isExpanded(props.node.id));

const toggle = () => {
    emit('toggle', props.node.id);
};

const handleToggle = (nodeId: string) => {
    emit('toggle', nodeId);
};

const getLevelColor = (level: number): string => {
    const colors = [
        'primary',
        'success',
        'info',
        'warning',
        'danger'
    ];
    return colors[level % colors.length] || 'secondary';
};
</script>

<template>
    <div class="referral-tree-node" :style="{ marginLeft: `${level * 30}px` }">
        <div 
            class="node-card mb-2" 
            :class="`border-${getLevelColor(level)}`"
            :style="{ borderLeftWidth: '3px' }"
        >
            <div class="card-body p-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center flex-grow-1">
                        <div 
                            v-if="hasChildren" 
                            class="expand-btn me-2"
                            @click="toggle"
                            :class="{ 'expanded': expanded }"
                        >
                            <i class="bi" :class="expanded ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                        </div>
                        <div 
                            v-else 
                            class="expand-placeholder me-2"
                        ></div>
                        
                        <div class="avatar avatar-40 rounded-circle me-3" 
                             :class="`bg-${getLevelColor(level)}-subtle text-${getLevelColor(level)}`">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        
                        <div class="flex-grow-1">
                            <h6 class="mb-1">
                                {{ node.name && node.name !== '-' ? node.name : node.email }}
                            </h6>
                            <p class="small text-muted mb-0">
                                <i class="bi bi-envelope me-1"></i>{{ node.email }}
                            </p>
                            <div class="d-flex gap-3 mt-1">
                                <span class="badge bg-secondary small">
                                    Уровень {{ node.level }}
                                </span>
                                <span v-if="hasChildren" class="badge bg-info small">
                                    {{ node.children.length }} прямых
                                </span>
                                <span v-if="hasChildren" class="badge bg-success small">
                                    {{ countAll(node) - 1 }} всего
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-end">
                        <p class="small text-muted mb-0">
                            <code class="small">{{ node.referralCode }}</code>
                        </p>
                        <p class="small text-muted mb-0">
                            {{ formatDate(node.created_at) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="hasChildren && expanded" class="children-container">
            <ReferralTreeNode
                v-for="child in node.children"
                :key="child.id"
                :node="child"
                :level="level + 1"
                :expanded-nodes="expandedNodes"
                :is-expanded="isExpanded"
                @toggle="handleToggle"
                :format-date="formatDate"
                :count-all="countAll"
            />
        </div>
    </div>
</template>

<style scoped>
.node-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.2s;
}

.node-card:hover {
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transform: translateX(2px);
}

.expand-btn {
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
}

.expand-btn:hover {
    background: rgba(0,0,0,0.05);
}

.expand-placeholder {
    width: 24px;
}

.children-container {
    position: relative;
}

.children-container::before {
    content: '';
    position: absolute;
    left: 12px;
    top: -10px;
    bottom: 0;
    width: 2px;
    background: #e0e0e0;
}

.referral-tree-node {
    position: relative;
}
</style>
