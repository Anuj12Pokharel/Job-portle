import { Router } from "express";
import { createContact } from "../controller/ContactController";

const router = Router();

router.post("/", createContact);

export default router;
