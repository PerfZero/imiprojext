<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "../components/AdminLayout.vue";
import DataTable from "../components/DataTable.vue";
import apiService from "@/services/apiService";

const attributes = ref([]);
const loading = ref(true);
const showModal = ref(false);
const showValueModal = ref(false);
const editingAttribute = ref(null);
const selectedAttribute = ref(null);
const attributeValues = ref([]);
const newValue = ref({ value: "", extra: "" });

const columns = [
    { key: "id", label: "ID", width: "60px" },
    { key: "name", label: "Название" },
    { key: "slug", label: "Slug" },
    {
        key: "type",
        label: "Тип",
        type: "badge",
        badgeClass: () => "bg-secondary",
    },
    {
        key: "actions",
        label: "Действия",
        type: "actions",
        width: "150px",
        actions: [
            { name: "values", icon: "bi bi-list-ul", class: "btn-outline-info", label: "Значения" },
            { name: "delete", icon: "bi bi-trash", class: "btn-outline-danger", label: "Удалить" },
        ],
    },
];

const emptyAttribute = {
    name: "",
    slug: "",
    type: "text",
};

const loadAttributes = async () => {
    loading.value = true;
    try {
        attributes.value = await apiService.getAttributes();
    } catch (error) {
        console.error("Ошибка загрузки атрибутов:", error);
    } finally {
        loading.value = false;
    }
};

const loadAttributeValues = async (attributeId) => {
    try {
        attributeValues.value = await apiService.getAttributeValues(attributeId);
    } catch (error) {
        console.error("Ошибка загрузки значений:", error);
    }
};

const handleAction = async ({ action, item }) => {
    if (action === "values") {
        selectedAttribute.value = item;
        await loadAttributeValues(item.id);
        showValueModal.value = true;
    } else if (action === "delete") {
        if (confirm(`Удалить атрибут "${item.name}"?`)) {
            try {
                await apiService.deleteAttribute(item.id);
                loadAttributes();
            } catch (error) {
                alert("Ошибка удаления атрибута");
            }
        }
    }
};

const openCreateModal = () => {
    editingAttribute.value = { ...emptyAttribute };
    showModal.value = true;
};

const saveAttribute = async () => {
    try {
        const data = {
            name: editingAttribute.value.name,
            slug: editingAttribute.value.slug,
            type: editingAttribute.value.type,
        };

        await apiService.createAttribute(data);
        showModal.value = false;
        loadAttributes();
    } catch (error) {
        alert("Ошибка сохранения атрибута");
        console.error(error);
    }
};

const addValue = async () => {
    try {
        await apiService.createAttributeValue({
            attributeId: selectedAttribute.value.id,
            value: newValue.value.value,
            extra: newValue.value.extra || null,
        });
        newValue.value = { value: "", extra: "" };
        await loadAttributeValues(selectedAttribute.value.id);
    } catch (error) {
        alert("Ошибка добавления значения");
    }
};

const deleteValue = async (valueId) => {
    if (confirm("Удалить это значение?")) {
        try {
            await apiService.deleteAttributeValue(valueId);
            await loadAttributeValues(selectedAttribute.value.id);
        } catch (error) {
            alert("Ошибка удаления значения");
        }
    }
};

const generateSlug = () => {
    if (editingAttribute.value.name && !editingAttribute.value.slug) {
        editingAttribute.value.slug = editingAttribute.value.name
            .toLowerCase()
            .replace(/[а-яё]/g, (char) => {
                const map = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
                return map[char] || char;
            })
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }
};

onMounted(() => loadAttributes());
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Атрибуты товаров</h4>
            <button class="btn btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-lg me-1"></i> Добавить атрибут
            </button>
        </div>

        <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Атрибуты — это характеристики товаров (Цвет, Память, Размер и т.д.).
            Для каждого атрибута можно задать несколько значений.
        </div>

        <DataTable
            :columns="columns"
            :data="attributes"
            :loading="loading"
            @action="handleAction"
        />

        <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Новый атрибут</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Название</label>
                            <input
                                type="text"
                                class="form-control"
                                v-model="editingAttribute.name"
                                @blur="generateSlug"
                                placeholder="Цвет, Память, Размер..."
                            />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Slug</label>
                            <input type="text" class="form-control" v-model="editingAttribute.slug" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Тип значений</label>
                            <select class="form-select" v-model="editingAttribute.type">
                                <option value="text">Текст</option>
                                <option value="number">Число</option>
                                <option value="color">Цвет</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">Отмена</button>
                        <button type="button" class="btn btn-primary" @click="saveAttribute">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showValueModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Значения атрибута "{{ selectedAttribute?.name }}"</h5>
                        <button type="button" class="btn-close" @click="showValueModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="newValue.value"
                                    placeholder="Значение (Чёрный, 256GB...)"
                                />
                            </div>
                            <div class="col" v-if="selectedAttribute?.type === 'color'">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="newValue.extra"
                                    placeholder="HEX цвет (#000000)"
                                />
                            </div>
                            <div class="col-auto">
                                <button class="btn btn-primary" @click="addValue" :disabled="!newValue.value">
                                    <i class="bi bi-plus-lg"></i> Добавить
                                </button>
                            </div>
                        </div>

                        <table class="table table-sm" v-if="attributeValues.length > 0">
                            <thead>
                                <tr>
                                    <th>Значение</th>
                                    <th v-if="selectedAttribute?.type === 'color'">Цвет</th>
                                    <th width="80"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="val in attributeValues" :key="val.id">
                                    <td>{{ val.value }}</td>
                                    <td v-if="selectedAttribute?.type === 'color'">
                                        <span
                                            v-if="val.extra"
                                            class="d-inline-block rounded"
                                            :style="{ background: val.extra, width: '24px', height: '24px' }"
                                        ></span>
                                        {{ val.extra }}
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-danger" @click="deleteValue(val.id)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-else class="text-muted text-center py-3">Нет значений</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showValueModal = false">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

