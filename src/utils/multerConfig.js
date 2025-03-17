// src/middleware/upload.js (o donde tengas tu configuración)
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../public/uploads");
const imageDir = path.join(uploadDir, "images");
const multimediaDir = path.join(uploadDir, "media");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(multimediaDir)) fs.mkdirSync(multimediaDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileType = file.mimetype;
        if (fileType.includes("image")) {
            cb(null, imageDir);
        } else {
            cb(null, multimediaDir);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });
export default upload;