import { Router } from "express";
import upload from "../middleware/upload";
import { submitForm } from "../controller/userFormController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/submit-form", protect, upload.single("resume"), submitForm);

export default router;
