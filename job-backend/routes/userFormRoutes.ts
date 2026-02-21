import { Router } from "express";
import upload from "../middleware/upload";
import { submitForm, getAllForms } from "../controller/userFormController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";

const router = Router();

router.post("/submit-form", protect, upload.single("resume"), submitForm);
router.get("/all", protect, checkAdmin, getAllForms);

export default router;
