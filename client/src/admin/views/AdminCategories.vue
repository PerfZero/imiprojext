<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import apiService from "@/services/apiService";

const categories = ref([]);
const loading = ref(true);
const showModal = ref(false);
const editingCategory = ref(null);

const columns = [
    { key: "id", label: "ID", width: "60px" },
    { key: "name", label: "Название" },
    { key: "slug", label: "Slug" },
    {
        key: "actions",
        label: "Действия",
        type: "actions",
        width: "120px",
        actions: [
            { name: "edit", icon: "bi bi-pencil", class: "btn-outline-primary", label: "Редактировать" },
            { name: "delete", icon: "bi bi-trash", class: "btn-outline-danger", label: "Удалить" },
        ],
    },
];

const emptyCategory = {
    name: "",
    slug: "",
};

const loadCategories = async () => {
    loading.value = true;
    try {
        categories.value = await apiService.getCategories();
    } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
    } finally {
        loading.value = false;
    }
};

const handleAction = async ({ action, item }) => {
    if (action === "edit") {
        editingCategory.value = { ...item };
        showModal.value = true;
    } else if (action === "delete") {
        if (confirm(`Удалить категорию "${item.name}"?`)) {
            try {
                await apiService.deleteCategory(item.id);
                loadCategories();
            } catch (error) {
                alert("Ошибка удаления категории");
            }
        }
    }
};

const openCreateModal = () => {
    editingCategory.value = { ...emptyCategory };
    showModal.value = true;
};

const saveCategory = async () => {
    try {
        const data = {
            name: editingCategory.value.name,
            slug: editingCategory.value.slug,
        };

        if (editingCategory.value.id) {
            await apiService.updateCategory(editingCategory.value.id, data);
        } else {
            await apiService.createCategory(data);
        }
        showModal.value = false;
        loadCategories();
    } catch (error) {
        alert("Ошибка сохранения категории");
        console.error(error);
    }
};

const generateSlug = () => {
    if (editingCategory.value.name && !editingCategory.value.slug) {
        editingCategory.value.slug = editingCategory.value.name
            .toLowerCase()
            .replace(/[а-яё]/g, (char) => {
                const map = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
                return map[char] || char;
            })
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }
};

onMounted(() => loadCategories());
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Категории товаров</h4>
            <button class="btn btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-lg me-1"></i> Добавить категорию
            </button>
        </div>

        <DataTable
            :columns="columns"
            :data="categories"
            :loading="loading"
            @action="handleAction"
        />

        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ editingCategory?.id ? "Редактирование категории" : "Новая категория" }}
                        </h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Название</label>
                            <input
                                type="text"
                                class="form-control"
                                v-model="editingCategory.name"
                                @blur="generateSlug"
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Slug (URL)</label>
                            <input type="text" class="form-control" v-model="editingCategory.slug" />
                            <small class="text-muted">Латиница, без пробелов</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">Отмена</button>
                        <button type="button" class="btn btn-primary" @click="saveCategory">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

