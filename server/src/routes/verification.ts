import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { isAuthenticated } from "../utils/isAuthenticated";
import { AppError } from "../utils/AppError";
import { services } from "../services";

const router = Router();

const verificationDir = path.join(process.cwd(), "uploads", "verification");
if (!fs.existsSync(verificationDir)) {
    fs.mkdirSync(verificationDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = (req as any).userId;
        if (!userId) {
            cb(new Error("User not authenticated"), "");
            return;
        }
        const userDir = path.join(verificationDir, userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = [
        "image/jpeg", 
        "image/jpg", 
        "image/png", 
        "image/webp",
        "image/heic",
        "image/heif",
        "application/octet-stream"
    ];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    const isValidMimeType = file.mimetype && allowedTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(fileExtension);
    
    if (isValidMimeType || isValidExtension) {
        cb(null, true);
    } else {
        cb(new Error(`Недопустимый тип файла. Разрешены только JPEG, PNG, WebP, HEIC. Получен тип: ${file.mimetype || 'неизвестно'}, расширение: ${fileExtension || 'нет'}`));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
    "/upload",
    isAuthenticated,
    upload.fields([
        { name: "passportPage1", maxCount: 1 },
        { name: "passportPage2", maxCount: 1 },
        { name: "selfieWithPassport", maxCount: 1 },
    ]),
    async (req, res, next) => {
        try {
            const userId = (req as any).userId;
            if (!userId) {
                throw new AppError("User not authenticated", 401);
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files.passportPage1 || !files.passportPage2 || !files.selfieWithPassport) {
                throw new AppError("Все три файла обязательны для загрузки", 400);
            }

            const passportPage1Url = `/uploads/verification/${userId}/${files.passportPage1[0].filename}`;
            const passportPage2Url = `/uploads/verification/${userId}/${files.passportPage2[0].filename}`;
            const selfieWithPassportUrl = `/uploads/verification/${userId}/${files.selfieWithPassport[0].filename}`;

            const verification = await services.verificationService.createVerification({
                userId,
                passportPage1Url,
                passportPage2Url,
                selfieWithPassportUrl,
            });

            res.json(verification);
        } catch (err) {
            next(err);
        }
    }
);

router.get("/status", isAuthenticated, async (req, res, next) => {
    try {
        const userId = (req as any).userId;
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }

        const verification = await services.verificationService.getVerificationByUserId(userId);
        res.json(verification || { status: "none" });
    } catch (err) {
        next(err);
    }
});

router.get("/:userId", isAuthenticated, async (req, res, next) => {
    try {
        const currentUserId = (req as any).userId;
        const requestedUserId = req.params.userId;

        const currentUser = await services.userService.getUserById(currentUserId);
        if (!currentUser || currentUser.role !== "admin") {
            throw new AppError("Access denied", 403);
        }

        const verification = await services.verificationService.getVerificationByUserId(requestedUserId);
        res.json(verification);
    } catch (err) {
        next(err);
    }
});

export const verificationRouter = router;

