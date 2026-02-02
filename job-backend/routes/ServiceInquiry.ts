import { Router } from "express";
import { createServiceInquiry } from "../controller/ServiceInquiry";

const router = Router();

router.post("/service-inquiry", createServiceInquiry);

export default router;
