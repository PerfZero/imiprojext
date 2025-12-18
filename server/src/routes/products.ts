import { Router } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { services } from "../services";
import { isAuthenticated } from "../utils/isAuthenticated";
import { isAdmin } from "../utils/isAdmin";

const router = Router();

const createCategorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
});

const createProductSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(5000).nullable().optional(),
    price: z.number().positive().max(999999999.99),
    currency: z.string().default("RUB"),
    image: z.string().nullable().optional(),
    categoryId: z.number().nullable().optional(),
    discount: z.number().min(0).default(0),
    discountType: z.enum(["percentage", "fixed"]).default("percentage"),
    stock: z.number().int().min(0).max(2147483647).default(0),
    isActive: z.boolean().default(true),
    imageUrls: z.array(z.object({
        url: z.string(),
        isMain: z.boolean().optional(),
    })).optional(),
});

const updateProductSchema = createProductSchema.partial();

const createAttributeSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    type: z.string().default("text"),
});

const createAttributeValueSchema = z.object({
    attributeId: z.number(),
    value: z.string().min(1),
    extra: z.string().nullable().optional(),
});

const createVariantSchema = z.object({
    productId: z.number(),
    sku: z.string().max(255).nullable().optional(),
    price: z.number().positive().max(999999999.99).nullable().optional(),
    stock: z.number().int().min(0).max(2147483647).default(0),
    image: z.string().nullable().optional(),
    attributeValueIds: z.array(z.number()).optional(),
});

router.get("/categories", async (_req, res, next) => {
    try {
        const categories = await services.productService.getCategories();
        res.json(categories);
    } catch (err) {
        next(err);
    }
});

router.post("/categories", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const parsed = createCategorySchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }
        const category = await services.productService.createCategory(parsed.data);
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
});

router.put("/categories/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const parsed = createCategorySchema.partial().safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }
        const category = await services.productService.updateCategory(id, parsed.data);
        res.json(category);
    } catch (err) {
        next(err);
    }
});

router.delete("/categories/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await services.productService.deleteCategory(id);
        res.json({ status: "ok" });
    } catch (err) {
        next(err);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const categoryId = req.query.categoryId
            ? parseInt(req.query.categoryId as string)
            : undefined;
        const products = await services.productService.getProducts(categoryId);
        res.json(products);
    } catch (err) {
        next(err);
    }
});

router.get("/all", isAuthenticated, isAdmin, async (_req, res, next) => {
    try {
        const products = await services.productService.getAllProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const product = await services.productService.getProductWithVariants(id);
        if (!product) {
            throw new AppError("Товар не найден", 404);
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
});

router.post("/", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const parsed = createProductSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.errors.map(err => {
                const field = err.path.join('.');
                return `${field}: ${err.message}`;
            }).join(', ');
            throw new AppError(`Ошибка валидации: ${errors}`, 400);
        }
        
        const { imageUrls, ...productData } = parsed.data;
        
        if (productData.discountType === "percentage" && productData.discount > 100) {
            throw new AppError("Скидка в процентах не может превышать 100%", 400);
        }
        if (productData.discountType === "fixed" && productData.discount > productData.price) {
            throw new AppError("Фиксированная скидка не может превышать цену товара", 400);
        }
        
        const product = await services.productService.createProduct(productData);
        
        if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
            try {
                for (const img of imageUrls) {
                    if (img && img.url && typeof img.url === 'string') {
                        await services.productService.addProductImage(
                            product.id, 
                            img.url, 
                            Boolean(img.isMain)
                        );
                    }
                }
            } catch (imgError) {
                console.error("Ошибка при добавлении изображений:", imgError);
                throw new AppError(`Ошибка при добавлении изображений: ${imgError instanceof Error ? imgError.message : 'Неизвестная ошибка'}`, 500);
            }
        }
        
        const productWithImages = await services.productService.getProductWithVariants(product.id);
        res.status(201).json(productWithImages || product);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const parsed = updateProductSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.errors.map(err => {
                const field = err.path.join('.');
                return `${field}: ${err.message}`;
            }).join(', ');
            throw new AppError(`Ошибка валидации: ${errors}`, 400);
        }
        const product = await services.productService.updateProduct(id, parsed.data);
        res.json(product);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await services.productService.deleteProduct(id);
        res.json({ status: "ok" });
    } catch (err) {
        next(err);
    }
});

router.put("/:id/attributes", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { attributeValueIds } = req.body;
        if (!Array.isArray(attributeValueIds)) {
            throw new AppError("attributeValueIds должен быть массивом", 400);
        }
        await services.productService.setProductAttributes(id, attributeValueIds);
        const attrs = await services.productService.getProductAttributes(id);
        res.json(attrs);
    } catch (err) {
        next(err);
    }
});

router.get("/:id/images", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const images = await services.productService.getProductImages(id);
        res.json(images);
    } catch (err) {
        next(err);
    }
});

router.post("/:id/images", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { url, isMain } = req.body;
        if (!url) {
            throw new AppError("url обязателен", 400);
        }
        const image = await services.productService.addProductImage(id, url, isMain || false);
        res.status(201).json(image);
    } catch (err) {
        next(err);
    }
});

router.put("/images/:imageId/main", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const imageId = parseInt(req.params.imageId);
        const images = await services.productService.setMainImage(imageId);
        res.json(images);
    } catch (err) {
        next(err);
    }
});

router.delete("/images/:imageId", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const imageId = parseInt(req.params.imageId);
        await services.productService.deleteProductImage(imageId);
        res.json({ status: "ok" });
    } catch (err) {
        next(err);
    }
});

router.get("/attributes/list", async (_req, res, next) => {
    try {
        const attributes = await services.productService.getAttributes();
        res.json(attributes);
    } catch (err) {
        next(err);
    }
});

router.post("/attributes", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const parsed = createAttributeSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }
        const attr = await services.productService.createAttribute(parsed.data);
        res.status(201).json(attr);
    } catch (err) {
        next(err);
    }
});

router.delete("/attributes/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await services.productService.deleteAttribute(id);
        res.json({ status: "ok" });
    } catch (err) {
        next(err);
    }
});

router.get("/attributes/:id/values", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const values = await services.productService.getAttributeValues(id);
        res.json(values);
    } catch (err) {
        next(err);
    }
});

router.post("/attributes/values", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const parsed = createAttributeValueSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }
        const value = await services.productService.createAttributeValue(parsed.data);
        res.status(201).json(value);
    } catch (err) {
        next(err);
    }
});

router.delete("/attributes/values/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await services.productService.deleteAttributeValue(id);
        res.json({ status: "ok" });
    } catch (err) {
        next(err);
    }
});

router.post("/variants", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const parsed = createVariantSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const { attributeValueIds, ...variantData } = parsed.data;
        const variant = await services.productService.createProductVariant(variantData);

        if (attributeValueIds && attributeValueIds.length > 0) {
            for (const attrValueId of attributeValueIds) {
                await services.productService.addVariantAttribute(variant.id, attrValueId);
            }
        }

        res.status(201).json(variant);
    } catch (err) {
        next(err);
    }
});

router.put("/variants/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const variant = await services.productService.updateProductVariant(id, req.body);
        res.json(variant);
    } catch (err) {
        next(err);
    }
});

router.delete("/variants/:id", isAuthenticated, isAdmin, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await services.productService.deleteProductVariant(id);
        res.json({ status: "ok" });
    } catch (err) {
        next(err);
    }
});

export const productRouter = router;

