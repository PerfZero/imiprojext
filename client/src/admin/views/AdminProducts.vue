<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import apiService from "@/services/apiService";

const router = useRouter();
const products = ref([]);
const categories = ref([]);
const loading = ref(true);

const columns = [
    { key: "id", label: "ID", width: "60px" },
    { key: "name", label: "Название" },
    { key: "price", label: "Цена", render: (item) => `₽ ${item.price.toLocaleString()}` },
    {
        key: "discount",
        label: "Скидка",
        type: "badge",
        render: (item) => item.discount ? `${item.discount}%` : "-",
        badgeClass: (item) => item.discount > 0 ? "bg-success" : "bg-secondary",
    },
    { key: "stock", label: "Остаток" },
    {
        key: "isActive",
        label: "Статус",
        type: "badge",
        render: (item) => item.isActive ? "Активен" : "Скрыт",
        badgeClass: (item) => item.isActive ? "bg-success" : "bg-secondary",
    },
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

const loadProducts = async () => {
    loading.value = true;
    try {
        const result = await apiService.getProducts();
        products.value = result;
    } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
    } finally {
        loading.value = false;
    }
};

const loadCategories = async () => {
    try {
        categories.value = await apiService.getCategories();
    } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
    }
};

const handleAction = async ({ action, item }) => {
    if (action === "edit") {
        router.push(`/admin/products/${item.id}`);
    } else if (action === "delete") {
        if (confirm(`Удалить товар "${item.name}"?`)) {
            try {
                await apiService.deleteProduct(item.id);
                loadProducts();
            } catch (error) {
                alert("Ошибка удаления товара");
            }
        }
    }
};

const createProduct = () => {
    router.push("/admin/products/new");
};

onMounted(() => {
    loadProducts();
    loadCategories();
});
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Товары</h4>
            <button class="btn btn-primary" @click="createProduct">
                <i class="bi bi-plus-lg me-1"></i> Добавить товар
            </button>
        </div>

        <div class="card mb-4" v-if="categories.length > 0">
            <div class="card-body py-2">
                <span class="text-muted me-2">Категории:</span>
                <span v-for="cat in categories" :key="cat.id" class="badge bg-secondary me-1">
                    {{ cat.name }}
                </span>
            </div>
        </div>

        <DataTable
            :columns="columns"
            :data="products"
            :loading="loading"
            @action="handleAction"
        />
    </AdminLayout>
</template>

