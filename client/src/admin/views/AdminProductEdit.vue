<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "../components/AdminLayout.vue";
import apiService from "@/services/apiService";

const route = useRoute();
const router = useRouter();

const productId = computed(() => route.params.id ? Number(route.params.id) : null);
const isNew = computed(() => !productId.value);

const loading = ref(false);
const saving = ref(false);
const uploading = ref(false);
const categories = ref([]);
const attributes = ref([]);
const attributeValues = ref({});
const images = ref([]);

const product = ref({
    name: "",
    description: "",
    price: 0,
    currency: "RUB",
    image: "",
    categoryId: null,
    discount: 0,
    discountType: "percentage",
    stock: 0,
    isActive: true,
});

const selectedAttributes = ref({});
const variants = ref([]);
const pendingImages = ref([]);
const newVariant = ref({
    sku: "",
    price: null,
    stock: 0,
    image: "",
    selectedAttributes: {},
});

const loadProduct = async () => {
    if (!productId.value) return;
    
    loading.value = true;
    try {
        const data = await apiService.getProduct(productId.value);
        product.value = data;
        if (data.variants) {
            variants.value = data.variants;
        }
        if (data.attributes) {
            data.attributes.forEach((attr) => {
                selectedAttributes.value[attr.attributeId] = attr.id;
            });
        }
        if (data.images) {
            images.value = data.images;
        }
    } catch (error) {
        console.error("Ошибка загрузки товара:", error);
        alert("Товар не найден");
        router.push("/admin/products");
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

const loadAttributes = async () => {
    try {
        attributes.value = await apiService.getAttributes();
        for (const attr of attributes.value) {
            const values = await apiService.getAttributeValues(attr.id);
            attributeValues.value[attr.id] = values;
        }
    } catch (error) {
        console.error("Ошибка загрузки атрибутов:", error);
    }
};

const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    uploading.value = true;
    try {
        for (const file of files) {
            const result = await apiService.uploadImage(file);
            
            if (productId.value) {
                const isMain = images.value.length === 0;
                await apiService.addProductImage(productId.value, result.url, isMain);
                await loadImages();
            } else {
                const isMain = pendingImages.value.length === 0;
                pendingImages.value.push({
                    url: result.url,
                    isMain: isMain,
                    id: Date.now() + Math.random()
                });
            }
        }
    } catch (error) {
        alert("Ошибка загрузки изображения");
        console.error(error);
    } finally {
        uploading.value = false;
        event.target.value = "";
    }
};

const loadImages = async (id = null) => {
    const targetId = id || productId.value;
    if (!targetId) return;
    images.value = await apiService.getProductImages(targetId);
};

const setMainImage = async (imageId) => {
    try {
        if (typeof imageId === 'number') {
            images.value = await apiService.setMainImage(imageId);
        } else {
            pendingImages.value.forEach(img => {
                img.isMain = img.id === imageId;
            });
        }
    } catch (error) {
        alert("Ошибка установки главного изображения");
    }
};

const deleteImage = async (imageId) => {
    if (!confirm("Удалить это изображение?")) return;
    try {
        if (typeof imageId === 'number') {
            await apiService.deleteProductImage(imageId);
            await loadImages();
        } else {
            pendingImages.value = pendingImages.value.filter(img => img.id !== imageId);
            if (pendingImages.value.length > 0 && !pendingImages.value.some(img => img.isMain)) {
                pendingImages.value[0].isMain = true;
            }
        }
    } catch (error) {
        alert("Ошибка удаления изображения");
    }
};

const handleVariantImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const result = await apiService.uploadImage(file);
        newVariant.value.image = result.url;
    } catch (error) {
        alert("Ошибка загрузки изображения");
        console.error(error);
    }
};

const saveProduct = async () => {
    if (!product.value.name || product.value.name.trim() === '') {
        alert("Ошибка: Укажите название товара");
        return;
    }

    if (product.value.name.trim().length > 255) {
        alert("Ошибка: Название товара не должно превышать 255 символов");
        return;
    }

    const price = Number(product.value.price);
    if (!price || price <= 0 || isNaN(price)) {
        alert("Ошибка: Укажите корректную цену товара (больше 0)");
        return;
    }
    if (price > 999999999.99) {
        alert("Ошибка: Цена не может превышать 999,999,999.99 ₽");
        return;
    }

    const discount = Number(product.value.discount) || 0;
    const discountType = product.value.discountType || "percentage";
    
    if (discount < 0 || isNaN(discount)) {
        alert("Ошибка: Скидка не может быть отрицательной");
        return;
    }
    
    if (discountType === "percentage" && discount > 100) {
        alert("Ошибка: Скидка в процентах не может превышать 100%");
        return;
    }
    
    if (discountType === "fixed" && discount > price) {
        alert("Ошибка: Фиксированная скидка не может превышать цену товара");
        return;
    }

    const stock = Number(product.value.stock) || 0;
    if (stock < 0 || isNaN(stock) || !Number.isInteger(stock)) {
        alert("Ошибка: Остаток на складе должен быть целым числом от 0");
        return;
    }
    if (stock > 2147483647) {
        alert("Ошибка: Остаток на складе не может превышать 2,147,483,647");
        return;
    }

    if (product.value.description && product.value.description.length > 5000) {
        alert("Ошибка: Описание не может превышать 5000 символов");
        return;
    }

    saving.value = true;
    try {
        const mainImage = images.value.find(img => img.isMain) || pendingImages.value.find(img => img.isMain);
        
        const data = {
            name: product.value.name.trim(),
            description: product.value.description?.trim() || null,
            price: price,
            currency: product.value.currency || "RUB",
            image: mainImage?.url || product.value.image || null,
            categoryId: product.value.categoryId ? Number(product.value.categoryId) : null,
            discount: Math.round(discount * 100) / 100,
            discountType: product.value.discountType || "percentage",
            stock: Math.floor(stock),
            isActive: product.value.isActive,
            imageUrls: !productId.value && pendingImages.value.length > 0 
                ? pendingImages.value.map(img => ({ url: img.url, isMain: img.isMain || false }))
                : undefined,
        };

        let currentProductId = productId.value;

        if (currentProductId) {
            await apiService.updateProduct(currentProductId, data);
        } else {
            const created = await apiService.createProduct(data);
            currentProductId = created.id;
            pendingImages.value = [];
        }

        const attributeValueIds = Object.values(selectedAttributes.value).filter(Boolean);
        if (attributeValueIds.length > 0) {
            await apiService.setProductAttributes(currentProductId, attributeValueIds);
        }

        if (!productId.value) {
            await loadImages(currentProductId);
            router.push(`/admin/products/${currentProductId}`);
            return;
        }

        await loadImages();
        alert("Сохранено");
    } catch (error) {
        const errorMessage = error?.error || error?.message || "Неизвестная ошибка";
        alert(`Ошибка сохранения товара: ${errorMessage}`);
        console.error("Детали ошибки:", error);
    } finally {
        saving.value = false;
    }
};

const addVariant = async () => {
    if (!productId.value) {
        alert("Сначала сохраните товар");
        return;
    }

    const variantPrice = newVariant.value.price ? Number(newVariant.value.price) : null;
    if (variantPrice !== null && (variantPrice <= 0 || isNaN(variantPrice))) {
        alert("Ошибка: Цена варианта должна быть больше 0");
        return;
    }
    if (variantPrice !== null && variantPrice > 999999999.99) {
        alert("Ошибка: Цена варианта не может превышать 999,999,999.99 ₽");
        return;
    }

    const variantStock = Number(newVariant.value.stock) || 0;
    if (variantStock < 0 || isNaN(variantStock) || !Number.isInteger(variantStock)) {
        alert("Ошибка: Остаток варианта должен быть целым числом от 0");
        return;
    }
    if (variantStock > 2147483647) {
        alert("Ошибка: Остаток варианта не может превышать 2,147,483,647");
        return;
    }

    if (newVariant.value.sku && newVariant.value.sku.length > 255) {
        alert("Ошибка: SKU не может превышать 255 символов");
        return;
    }
    
    try {
        const attributeValueIds = Object.values(newVariant.value.selectedAttributes).filter(Boolean);
        
        await apiService.createProductVariant({
            productId: productId.value,
            sku: newVariant.value.sku?.trim() || null,
            price: variantPrice,
            stock: Math.floor(variantStock),
            image: newVariant.value.image || null,
            attributeValueIds,
        });
        
        newVariant.value = {
            sku: "",
            price: null,
            stock: 0,
            image: "",
            selectedAttributes: {},
        };
        
        loadProduct();
    } catch (error) {
        alert("Ошибка добавления варианта");
        console.error(error);
    }
};

const deleteVariant = async (variantId) => {
    if (!confirm("Удалить этот вариант?")) return;
    
    try {
        await apiService.deleteProductVariant(variantId);
        loadProduct();
    } catch (error) {
        alert("Ошибка удаления варианта");
    }
};

const goBack = () => {
    router.push("/admin/products");
};

onMounted(() => {
    loadCategories();
    loadAttributes();
    loadProduct().then(() => {
        if (productId.value) {
            loadImages();
        }
    });
});
</script>

<template>
    <AdminLayout>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-3">
                <button class="btn btn-outline-secondary" @click="goBack">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h4 class="mb-0">{{ isNew ? "Новый товар" : "Редактирование товара" }}</h4>
            </div>
            <button class="btn btn-primary" @click="saveProduct" :disabled="saving">
                <i class="bi bi-check-lg me-1"></i>
                {{ saving ? "Сохранение..." : "Сохранить" }}
            </button>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <div v-else class="row">
            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-header">
                        <h6 class="mb-0">Основная информация</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Название товара <span class="text-danger">*</span></label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="product.name" 
                                required
                                maxlength="255"
                            />
                            <small class="text-muted">Обязательное поле, максимум 255 символов</small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Описание</label>
                            <textarea 
                                class="form-control" 
                                v-model="product.description" 
                                rows="4"
                                maxlength="5000"
                            ></textarea>
                            <small class="text-muted">Максимум 5000 символов</small>
                        </div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">Изображения</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <input
                                type="file"
                                class="form-control"
                                accept="image/*"
                                multiple
                                @change="handleImageUpload"
                                :disabled="uploading"
                            />
                            <small class="text-muted">JPG, PNG, GIF, WebP. Можно выбрать несколько файлов.</small>
                        </div>

                        <div v-if="uploading" class="text-center py-3">
                            <div class="spinner-border spinner-border-sm me-2"></div>
                            Загрузка...
                        </div>

                        <div v-if="images.length > 0 || pendingImages.length > 0" class="row g-3">
                            <div v-for="img in [...images, ...pendingImages]" :key="img.id" class="col-6 col-md-4 col-lg-3">
                                <div class="position-relative border rounded overflow-hidden" :class="{ 'border-primary border-2': img.isMain }">
                                    <img :src="img.url" alt="" class="w-100" style="height: 120px; object-fit: cover;" />
                                    <div class="position-absolute top-0 start-0 end-0 p-1 d-flex justify-content-between">
                                        <span v-if="img.isMain" class="badge bg-primary">Главная</span>
                                        <span v-else></span>
                                        <button
                                            class="btn btn-sm btn-danger"
                                            @click="deleteImage(img.id)"
                                            style="padding: 0.1rem 0.4rem;"
                                        >
                                            <i class="bi bi-x"></i>
                                        </button>
                                    </div>
                                    <div v-if="!img.isMain" class="position-absolute bottom-0 start-0 end-0 p-1">
                                        <button class="btn btn-sm btn-light w-100" @click="setMainImage(img.id)">
                                            Сделать главной
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p v-else class="text-muted mb-0">Нет изображений</p>
                    </div>
                </div>

                <div class="card mb-4" v-if="attributes.length > 0">
                    <div class="card-header">
                        <h6 class="mb-0">Атрибуты товара</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div v-for="attr in attributes" :key="attr.id" class="col-md-4 mb-3">
                                <label class="form-label">{{ attr.name }}</label>
                                <select class="form-select" v-model="selectedAttributes[attr.id]">
                                    <option :value="null">Не указан</option>
                                    <option
                                        v-for="val in attributeValues[attr.id]"
                                        :key="val.id"
                                        :value="val.id"
                                    >
                                        {{ val.value }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-4" v-if="productId">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">Варианты товара</h6>
                        <small class="text-muted">Для разных комбинаций атрибутов</small>
                    </div>
                    <div class="card-body">
                        <div v-if="attributes.length > 0" class="border rounded p-3 mb-3 bg-light">
                            <h6 class="mb-3">Добавить вариант</h6>
                            <div class="row">
                                <div class="col-md-3 mb-2">
                                    <label class="form-label small">SKU</label>
                                    <input 
                                        type="text" 
                                        class="form-control form-control-sm" 
                                        v-model="newVariant.sku" 
                                        maxlength="255"
                                    />
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label small">Цена (если отличается)</label>
                                    <input 
                                        type="number" 
                                        class="form-control form-control-sm" 
                                        v-model.number="newVariant.price" 
                                        min="0.01" 
                                        max="999999999.99"
                                        step="0.01"
                                    />
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label small">Остаток</label>
                                    <input 
                                        type="number" 
                                        class="form-control form-control-sm" 
                                        v-model.number="newVariant.stock" 
                                        min="0" 
                                        max="2147483647"
                                        step="1"
                                    />
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label small">Изображение</label>
                                    <input
                                        type="file"
                                        class="form-control form-control-sm"
                                        accept="image/*"
                                        @change="handleVariantImageUpload"
                                    />
                                </div>
                            </div>
                            <div v-if="newVariant.image" class="mb-2">
                                <img :src="newVariant.image" alt="" class="img-thumbnail" style="max-height: 60px;" />
                            </div>
                            <div class="row mt-2">
                                <div v-for="attr in attributes" :key="attr.id" class="col-md-4 mb-2">
                                    <label class="form-label small">{{ attr.name }}</label>
                                    <select class="form-select form-select-sm" v-model="newVariant.selectedAttributes[attr.id]">
                                        <option :value="null">-</option>
                                        <option
                                            v-for="val in attributeValues[attr.id]"
                                            :key="val.id"
                                            :value="val.id"
                                        >
                                            {{ val.value }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-primary mt-2" @click="addVariant">
                                <i class="bi bi-plus-lg me-1"></i> Добавить вариант
                            </button>
                        </div>
                        <div v-else class="alert alert-info mb-0">
                            <i class="bi bi-info-circle me-2"></i>
                            Создайте атрибуты в разделе "Магазин → Атрибуты"
                        </div>

                        <table class="table table-sm" v-if="variants.length > 0">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Атрибуты</th>
                                    <th>Цена</th>
                                    <th>Остаток</th>
                                    <th width="60"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="v in variants" :key="v.id">
                                    <td>{{ v.sku || "-" }}</td>
                                    <td>
                                        <span v-for="attr in v.attributes" :key="attr.id" class="badge bg-secondary me-1">
                                            {{ attr.value }}
                                        </span>
                                        <span v-if="!v.attributes?.length" class="text-muted">-</span>
                                    </td>
                                    <td>{{ v.price ? `₽ ${v.price}` : "базовая" }}</td>
                                    <td>{{ v.stock }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-danger" @click="deleteVariant(v.id)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-else-if="attributes.length > 0" class="text-muted mb-0">Нет вариантов</p>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h6 class="mb-0">Цена и наличие</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Цена (₽) <span class="text-danger">*</span></label>
                            <input 
                                type="number" 
                                class="form-control" 
                                v-model.number="product.price" 
                                min="0.01" 
                                max="999999999.99"
                                step="0.01" 
                                required
                            />
                            <small class="text-muted">От 0.01 до 999,999,999.99 ₽</small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Тип скидки</label>
                            <select class="form-select mb-2" v-model="product.discountType">
                                <option value="percentage">Процент (%)</option>
                                <option value="fixed">Фиксированная сумма (₽)</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Размер скидки</label>
                            <input 
                                type="number" 
                                class="form-control" 
                                v-model.number="product.discount" 
                                :min="0" 
                                :max="product.discountType === 'percentage' ? 100 : product.price"
                                step="0.01"
                            />
                            <small class="text-muted">
                                <span v-if="product.discountType === 'percentage'">От 0 до 100%</span>
                                <span v-else>От 0 до {{ product.price || 0 }} ₽</span>
                            </small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Остаток на складе</label>
                            <input 
                                type="number" 
                                class="form-control" 
                                v-model.number="product.stock" 
                                min="0" 
                                max="2147483647"
                                step="1"
                            />
                            <small class="text-muted">От 0 до 2,147,483,647</small>
                        </div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h6 class="mb-0">Организация</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Категория</label>
                            <select class="form-select" v-model="product.categoryId">
                                <option :value="null">Без категории</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                    {{ cat.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-check form-switch">
                            <input type="checkbox" class="form-check-input" id="isActive" v-model="product.isActive" />
                            <label class="form-check-label" for="isActive">Активен (виден в магазине)</label>
                        </div>
                    </div>
                </div>

                <div class="card border-info" v-if="isNew">
                    <div class="card-body">
                        <h6 class="text-info"><i class="bi bi-info-circle me-1"></i> Подсказка</h6>
                        <p class="small mb-0">
                            Вы можете загрузить изображения до сохранения товара. Варианты можно добавить после сохранения.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

