import { Router } from "express";
import { createContact, getContacts } from "../controller/ContactController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";

const router = Router();

router.post("/submit", createContact);
router.get("/get", protect, checkAdmin, getContacts);

export default router;
