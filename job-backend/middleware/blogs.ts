import multer from "multer";
import path from "path";
import fs from "fs";


// Blog images
const blogStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads/blogs";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // save blog images here
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadBlogImage = multer({ storage: blogStorage });
