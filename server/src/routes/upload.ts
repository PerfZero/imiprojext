import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { isAuthenticated } from "../utils/isAuthenticated";
import { isAdmin } from "../utils/isAdmin";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Недопустимый тип файла"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/image", isAuthenticated, isAdmin, upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "Файл не загружен" });
        return;
    }

    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});

export const uploadRouter = router;

