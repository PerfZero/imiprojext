<script setup>
import { computed } from "vue";

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        default: () => [],
    },
    pagination: {
        type: Object,
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["page-change", "row-click", "action"]);

const pages = computed(() => {
    if (!props.pagination) return [];
    const { page, pages: totalPages } = props.pagination;
    const result = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
});

const getValue = (item, column) => {
    if (column.render) {
        return column.render(item);
    }
    const keys = column.key.split(".");
    let value = item;
    for (const key of keys) {
        value = value?.[key];
    }
    return value ?? "-";
};

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= props.pagination.pages) {
        emit("page-change", newPage);
    }
};
</script>

<template>
    <div class="data-table">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th v-for="col in columns" :key="col.key" :style="{ width: col.width }">
                            {{ col.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td :colspan="columns.length" class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Загрузка...</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="!data.length">
                        <td :colspan="columns.length" class="text-center py-4 text-muted">
                            Нет данных
                        </td>
                    </tr>
                    <tr
                        v-else
                        v-for="(item, index) in data"
                        :key="item.id || index"
                        @click="emit('row-click', item)"
                        class="cursor-pointer"
                    >
                        <td v-for="col in columns" :key="col.key">
                            <template v-if="col.type === 'actions'">
                                <div class="btn-group btn-group-sm">
                                    <button
                                        v-for="action in col.actions"
                                        :key="action.name"
                                        class="btn"
                                        :class="action.class || 'btn-outline-secondary'"
                                        @click.stop="emit('action', { action: action.name, item })"
                                        :title="action.label"
                                    >
                                        <i :class="action.icon"></i>
                                    </button>
                                </div>
                            </template>
                            <template v-else-if="col.type === 'badge'">
                                <span class="badge" :class="col.badgeClass?.(item) || 'bg-secondary'">
                                    {{ getValue(item, col) }}
                                </span>
                            </template>
                            <template v-else-if="col.type === 'date'">
                                {{ new Date(getValue(item, col)).toLocaleString("ru") }}
                            </template>
                            <template v-else-if="col.type === 'currency'">
                                {{ Number(getValue(item, col)).toLocaleString("ru", { minimumFractionDigits: 2 }) }}
                            </template>
                            <template v-else>
                                {{ getValue(item, col) }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="pagination && pagination.pages > 1" class="d-flex justify-content-between align-items-center p-3 border-top">
            <div class="text-muted small">
                Показано {{ (pagination.page - 1) * pagination.limit + 1 }} -
                {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
                из {{ pagination.total }}
            </div>
            <nav>
                <ul class="pagination pagination-sm mb-0">
                    <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                        <button class="page-link" @click="changePage(pagination.page - 1)">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                    </li>
                    <li
                        v-for="p in pages"
                        :key="p"
                        class="page-item"
                        :class="{ active: p === pagination.page }"
                    >
                        <button class="page-link" @click="changePage(p)">{{ p }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: pagination.page === pagination.pages }">
                        <button class="page-link" @click="changePage(pagination.page + 1)">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.data-table {
    background: #fff;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>
