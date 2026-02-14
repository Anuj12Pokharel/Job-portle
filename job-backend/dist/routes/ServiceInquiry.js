"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServiceInquiry_1 = require("../controller/ServiceInquiry");
const router = (0, express_1.Router)();
router.post("/service-inquiry", ServiceInquiry_1.createServiceInquiry);
exports.default = router;
