import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path.join(__dirname, "..", "..", "uploads", "client_logos");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const uploadLogo = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(null, false); // Reject file
        }
    },
});

export default uploadLogo;
