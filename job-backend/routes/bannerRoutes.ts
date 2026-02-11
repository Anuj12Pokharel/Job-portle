import express from "express";
import { getBanners, getBannerByType, upsertBanner, deleteBanner } from "../controller/bannerController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";
import uploadBanner from "../middleware/uploadBanner";

const router = express.Router();

router.get("/", getBanners);
router.get("/:type", getBannerByType);
router.post("/", protect, checkAdmin, uploadBanner.single("backgroundImage"), upsertBanner);
router.delete("/:id", protect, checkAdmin, deleteBanner);

export default router;
