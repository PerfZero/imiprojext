import { eq, and, desc } from "drizzle-orm";
import type { DbClient } from "../db";
import {
    categories,
    products,
    attributes,
    attributeValues,
    productVariants,
    productVariantAttributes,
    productAttributes,
    productImages,
} from "../db/schema";

export class ProductService {
    constructor(private db: DbClient) {}

    async getCategories() {
        return this.db.select().from(categories).orderBy(categories.name);
    }

    async getCategoryBySlug(slug: string) {
        const [category] = await this.db
            .select()
            .from(categories)
            .where(eq(categories.slug, slug));
        return category;
    }

    async createCategory(data: { name: string; slug: string }) {
        const [category] = await this.db
            .insert(categories)
            .values(data)
            .returning();
        return category;
    }

    async updateCategory(id: number, data: { name?: string; slug?: string }) {
        const [category] = await this.db
            .update(categories)
            .set(data)
            .where(eq(categories.id, id))
            .returning();
        return category;
    }

    async deleteCategory(id: number) {
        await this.db.delete(categories).where(eq(categories.id, id));
    }

    async getProducts(categoryId?: number) {
        if (categoryId) {
            return this.db
                .select()
                .from(products)
                .where(
                    and(
                        eq(products.categoryId, categoryId),
                        eq(products.isActive, true)
                    )
                )
                .orderBy(desc(products.createdAt));
        }
        return this.db
            .select()
            .from(products)
            .where(eq(products.isActive, true))
            .orderBy(desc(products.createdAt));
    }

    async getAllProducts() {
        return this.db.select().from(products).orderBy(desc(products.createdAt));
    }

    async getProductById(id: number) {
        const [product] = await this.db
            .select()
            .from(products)
            .where(eq(products.id, id));
        return product;
    }

    async getProductWithVariants(id: number) {
        const product = await this.getProductById(id);
        if (!product) return null;

        const productAttrs = await this.db
            .select({
                id: attributeValues.id,
                attributeId: attributeValues.attributeId,
                value: attributeValues.value,
                extra: attributeValues.extra,
                attributeName: attributes.name,
                attributeSlug: attributes.slug,
            })
            .from(productAttributes)
            .innerJoin(
                attributeValues,
                eq(productAttributes.attributeValueId, attributeValues.id)
            )
            .innerJoin(
                attributes,
                eq(attributeValues.attributeId, attributes.id)
            )
            .where(eq(productAttributes.productId, id));

        const variants = await this.db
            .select()
            .from(productVariants)
            .where(eq(productVariants.productId, id));

        const variantsWithAttributes = await Promise.all(
            variants.map(async (variant) => {
                const attrs = await this.db
                    .select({
                        id: attributeValues.id,
                        attributeId: attributeValues.attributeId,
                        value: attributeValues.value,
                        extra: attributeValues.extra,
                        attributeName: attributes.name,
                        attributeSlug: attributes.slug,
                    })
                    .from(productVariantAttributes)
                    .innerJoin(
                        attributeValues,
                        eq(productVariantAttributes.attributeValueId, attributeValues.id)
                    )
                    .innerJoin(
                        attributes,
                        eq(attributeValues.attributeId, attributes.id)
                    )
                    .where(eq(productVariantAttributes.variantId, variant.id));

                return { ...variant, attributes: attrs };
            })
        );

        const images = await this.db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, id))
            .orderBy(productImages.sortOrder);

        return { ...product, attributes: productAttrs, variants: variantsWithAttributes, images };
    }

    async createProduct(data: {
        name: string;
        description?: string;
        price: number;
        currency?: string;
        image?: string;
        categoryId?: number;
        discount?: number;
        stock?: number;
        isActive?: boolean;
    }) {
        const [product] = await this.db
            .insert(products)
            .values(data)
            .returning();
        return product;
    }

    async updateProduct(
        id: number,
        data: {
            name?: string;
            description?: string;
            price?: number;
            currency?: string;
            image?: string;
            categoryId?: number;
            discount?: number;
            stock?: number;
            isActive?: boolean;
        }
    ) {
        const [product] = await this.db
            .update(products)
            .set(data)
            .where(eq(products.id, id))
            .returning();
        return product;
    }

    async deleteProduct(id: number) {
        await this.db.delete(productVariantAttributes).where(
            eq(
                productVariantAttributes.variantId,
                this.db
                    .select({ id: productVariants.id })
                    .from(productVariants)
                    .where(eq(productVariants.productId, id))
            )
        );
        await this.db.delete(productVariants).where(eq(productVariants.productId, id));
        await this.db.delete(products).where(eq(products.id, id));
    }

    async getAttributes() {
        return this.db.select().from(attributes);
    }

    async createAttribute(data: { name: string; slug: string; type?: string }) {
        const [attr] = await this.db
            .insert(attributes)
            .values(data)
            .returning();
        return attr;
    }

    async deleteAttribute(id: number) {
        await this.db.delete(attributeValues).where(eq(attributeValues.attributeId, id));
        await this.db.delete(attributes).where(eq(attributes.id, id));
    }

    async getAttributeValues(attributeId: number) {
        return this.db
            .select()
            .from(attributeValues)
            .where(eq(attributeValues.attributeId, attributeId));
    }

    async createAttributeValue(data: {
        attributeId: number;
        value: string;
        extra?: string;
    }) {
        const [val] = await this.db
            .insert(attributeValues)
            .values(data)
            .returning();
        return val;
    }

    async deleteAttributeValue(id: number) {
        await this.db.delete(attributeValues).where(eq(attributeValues.id, id));
    }

    async createProductVariant(data: {
        productId: number;
        sku?: string;
        price?: number;
        stock?: number;
        image?: string;
    }) {
        const [variant] = await this.db
            .insert(productVariants)
            .values(data)
            .returning();
        return variant;
    }

    async addVariantAttribute(variantId: number, attributeValueId: number) {
        const [link] = await this.db
            .insert(productVariantAttributes)
            .values({ variantId, attributeValueId })
            .returning();
        return link;
    }

    async updateProductVariant(
        id: number,
        data: {
            sku?: string;
            price?: number;
            stock?: number;
            image?: string;
        }
    ) {
        const [variant] = await this.db
            .update(productVariants)
            .set(data)
            .where(eq(productVariants.id, id))
            .returning();
        return variant;
    }

    async deleteProductVariant(id: number) {
        await this.db
            .delete(productVariantAttributes)
            .where(eq(productVariantAttributes.variantId, id));
        await this.db.delete(productVariants).where(eq(productVariants.id, id));
    }

    async setProductAttributes(productId: number, attributeValueIds: number[]) {
        await this.db
            .delete(productAttributes)
            .where(eq(productAttributes.productId, productId));

        if (attributeValueIds.length > 0) {
            await this.db.insert(productAttributes).values(
                attributeValueIds.map((attributeValueId) => ({
                    productId,
                    attributeValueId,
                }))
            );
        }
    }

    async getProductAttributes(productId: number) {
        return this.db
            .select({
                id: attributeValues.id,
                attributeId: attributeValues.attributeId,
                value: attributeValues.value,
                extra: attributeValues.extra,
                attributeName: attributes.name,
                attributeSlug: attributes.slug,
            })
            .from(productAttributes)
            .innerJoin(
                attributeValues,
                eq(productAttributes.attributeValueId, attributeValues.id)
            )
            .innerJoin(
                attributes,
                eq(attributeValues.attributeId, attributes.id)
            )
            .where(eq(productAttributes.productId, productId));
    }

    async addProductImage(productId: number, url: string, isMain: boolean = false) {
        if (isMain) {
            await this.db
                .update(productImages)
                .set({ isMain: false })
                .where(eq(productImages.productId, productId));
        }

        const maxOrder = await this.db
            .select({ max: productImages.sortOrder })
            .from(productImages)
            .where(eq(productImages.productId, productId));

        const sortOrder = (maxOrder[0]?.max ?? -1) + 1;

        const [image] = await this.db
            .insert(productImages)
            .values({ productId, url, isMain, sortOrder })
            .returning();
        return image;
    }

    async setMainImage(imageId: number) {
        const [image] = await this.db
            .select()
            .from(productImages)
            .where(eq(productImages.id, imageId));

        if (!image) return null;

        await this.db
            .update(productImages)
            .set({ isMain: false })
            .where(eq(productImages.productId, image.productId));

        await this.db
            .update(productImages)
            .set({ isMain: true })
            .where(eq(productImages.id, imageId));

        return this.db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, image.productId))
            .orderBy(productImages.sortOrder);
    }

    async deleteProductImage(imageId: number) {
        const [image] = await this.db
            .select()
            .from(productImages)
            .where(eq(productImages.id, imageId));

        await this.db.delete(productImages).where(eq(productImages.id, imageId));

        if (image?.isMain) {
            const [firstImage] = await this.db
                .select()
                .from(productImages)
                .where(eq(productImages.productId, image.productId))
                .orderBy(productImages.sortOrder)
                .limit(1);

            if (firstImage) {
                await this.db
                    .update(productImages)
                    .set({ isMain: true })
                    .where(eq(productImages.id, firstImage.id));
            }
        }
    }

    async getProductImages(productId: number) {
        return this.db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, productId))
            .orderBy(productImages.sortOrder);
    }
}

