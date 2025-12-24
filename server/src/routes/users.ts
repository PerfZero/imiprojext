import { Router } from "express";
import { isAuthenticated } from "./../utils/isAuthenticated";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { eq, sql, desc } from "drizzle-orm";

import { AppError } from "../utils/AppError";
import { services } from "../services";
import { db, user, userAddresses } from "../db";

const router = Router();

const avatarsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, avatarsDir);
    },
    filename: (req, file, cb) => {
        const userId =
            (req as any).session?.user?.id ?? req.params.id ?? "anonymous";
        const ext = path.extname(file.originalname) || ".png";
        cb(null, `${userId}-${Date.now()}${ext}`);
    },
});

const upload = multer({ storage });

async function makeSquareAvatar(inputPath: string, outputPath: string, targetSize = 256) {
    // Получаем метаданные исходного изображения
    const metadata = await sharp(inputPath).metadata();
    const { width, height, format } = metadata;

    if (!width || !height) {
        throw new Error("Не удалось определить размеры изображения");
    }

    // Определяем размер квадрата — минимальная из сторон оригинала
    const minSide = Math.min(width, height);

    // Вырезаем квадрат по центру из оригинала — всегда безопасно
    const pipeline = sharp(inputPath)
        .extract({
            left: Math.floor((width - minSide) / 2),
            top: Math.floor((height - minSide) / 2),
            width: minSide,
            height: minSide,
        })
        .resize(targetSize, targetSize, {
            fit: "cover", // на случай, если после extract нужно ещё подогнать (редко нужно, но безопасно)
            position: "center",
        });

    // Сохраняем в том же формате, если он поддерживается, или в JPEG по умолчанию
    if (format === "png") {
        pipeline.png({ quality: 90 });
    } else {
        pipeline.jpeg({ quality: 85 });
    }

    await pipeline.toFile(outputPath);
}

router.get("/referrer", isAuthenticated, async (req, res, next) => {
    try {
        const session = (req as any).session;
        const referrerId = session?.user?.referrerId;

        const user = await services.userService.getUserRefferer(referrerId);
        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.post(
    "/avatar",
    upload.single("avatar"),
    isAuthenticated,
    async (req, res, next) => {
        try {
            if (!req.file) {
                throw new AppError("Avatar file is required", 400);
            }

            const tempPath = req.file.path;
            const avatarPath = path.join(
                process.cwd(),
                "public",
                "uploads",
                "small-" + req.file.filename
            );

            await makeSquareAvatar(tempPath, avatarPath, 256);

            fs.unlinkSync(tempPath);

            if (!req.userId) {
                throw new AppError("User ID not found", 401);
            }
            const url = `/uploads/small-${req.file.filename}`;
            const user = await services.userService.updateAvatar(
                req.userId,
                url
            );

            res.json({ image: url, user });
        } catch (err) {
            next(err);
        }
    }
);

router.get("/balances", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        const balances = await services.walletService.getBalances(req.userId);
        res.json(balances);
    } catch (err) {
        next(err);
    }
});

router.get("/:id/upline", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        const upline = await services.userService.getUpline(req.userId);
        res.json(upline);
    } catch (err) {
        next(err);
    }
});

router.get("/my-referrals", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        
        const directReferrals = await db
            .select()
            .from(user)
            .where(eq(user.referrerId, req.userId))
            .orderBy(desc(user.created_at));
        
        const upline = await services.userService.getUpline(req.userId, 7);
        
        const referralStats = await db
            .select({ count: sql<number>`count(*)` })
            .from(user)
            .where(eq(user.referrerId, req.userId));
        
        const totalReferrals = referralStats[0]?.count ?? 0;
        
        const referralTree = await services.userService.getReferralTree(req.userId, 3);
        
        res.json({
            directReferrals,
            directReferralsCount: totalReferrals,
            upline: upline.map((u, index) => ({
                ...u,
                level: index + 1,
            })),
            referralTree,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/addresses", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        const addresses = await db
            .select()
            .from(userAddresses)
            .where(eq(userAddresses.userId, req.userId))
            .orderBy(desc(userAddresses.isDefault), desc(userAddresses.createdAt));
        res.json(addresses);
    } catch (err) {
        next(err);
    }
});

router.post("/addresses", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        const { name, phone, city, address, isDefault } = req.body;
        
        if (!name || !phone || !city || !address) {
            throw new AppError("Все поля обязательны", 400);
        }

        if (isDefault) {
            await db
                .update(userAddresses)
                .set({ isDefault: false })
                .where(eq(userAddresses.userId, req.userId));
        }

        const [newAddress] = await db
            .insert(userAddresses)
            .values({
                userId: req.userId,
                name,
                phone,
                city,
                address,
                isDefault: isDefault || false,
            })
            .returning();

        res.status(201).json(newAddress);
    } catch (err) {
        next(err);
    }
});

router.put("/addresses/:id", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        const id = parseInt(req.params.id);
        const { name, phone, city, address, isDefault } = req.body;

        const [existing] = await db
            .select()
            .from(userAddresses)
            .where(eq(userAddresses.id, id))
            .limit(1);

        if (!existing || existing.userId !== req.userId) {
            throw new AppError("Адрес не найден", 404);
        }

        if (isDefault) {
            await db
                .update(userAddresses)
                .set({ isDefault: false })
                .where(eq(userAddresses.userId, req.userId));
        }

        const [updated] = await db
            .update(userAddresses)
            .set({
                name,
                phone,
                city,
                address,
                isDefault: isDefault || false,
                updatedAt: Math.floor(Date.now() / 1000),
            })
            .where(eq(userAddresses.id, id))
            .returning();

        res.json(updated);
    } catch (err) {
        next(err);
    }
});

router.delete("/addresses/:id", isAuthenticated, async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new AppError("User ID not found", 401);
        }
        const id = parseInt(req.params.id);

        const [existing] = await db
            .select()
            .from(userAddresses)
            .where(eq(userAddresses.id, id))
            .limit(1);

        if (!existing || existing.userId !== req.userId) {
            throw new AppError("Адрес не найден", 404);
        }

        await db.delete(userAddresses).where(eq(userAddresses.id, id));
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

export const userRouter = router;
