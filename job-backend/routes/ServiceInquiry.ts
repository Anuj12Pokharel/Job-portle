import { Router } from "express";
import { createServiceInquiry, getServiceInquiries } from "../controller/ServiceInquiry";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";

const router = Router();

router.post("/service-inquiry", createServiceInquiry);
router.get("/all", protect, checkAdmin, getServiceInquiries);

export default router;
