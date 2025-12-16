import fs from "fs";
import { Router } from "express";
import { isAuthenticated } from "./../utils/isAuthenticated";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { AppError } from "../utils/AppError";
import { services } from "../services";

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

async function makeSquareAvatar(inputPath, outputPath, targetSize = 256) {
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
        const balances = await services.walletService.getBalances(req.userId);
        res.json(balances);
    } catch (err) {
        next(err);
    }
});

router.get("/:id/upline", isAuthenticated, async (req, res, next) => {
    try {
        const upline = await services.userService.getUpline(req.userId);
        res.json(upline);
    } catch (err) {
        next(err);
    }
});

export const userRouter = router;
