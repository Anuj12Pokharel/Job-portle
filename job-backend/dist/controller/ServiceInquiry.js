"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceInquiry = void 0;
const ServiceInquiry_1 = __importDefault(require("../models/ServiceInquiry"));
const createServiceInquiry = async (req, res) => {
    try {
        const { name, phone, email, address, company_size, service, message, } = req.body;
        // Validation
        if (!name ||
            !phone ||
            !email ||
            !address ||
            !company_size ||
            !service ||
            !message) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const inquiry = await ServiceInquiry_1.default.create({
            name,
            phone,
            email,
            address,
            company_size,
            service,
            message,
        });
        return res.status(201).json({
            message: "Your message has been sent successfully",
            inquiry,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.createServiceInquiry = createServiceInquiry;
