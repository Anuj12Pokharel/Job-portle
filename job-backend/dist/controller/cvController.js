"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCV = exports.updateCVData = exports.getCVData = void 0;
const User_1 = __importDefault(require("../models/User"));
const pdfService_1 = require("../services/pdfService");
const cvTemplates_1 = require("../templates/cvTemplates");
/**
 * Get CV data for the authenticated user
 */
const getCVData = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.cvData || {});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCVData = getCVData;
/**
 * Update CV data for the authenticated user
 */
const updateCVData = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.user?.id, { $set: { cvData: req.body } }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.cvData);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateCVData = updateCVData;
/**
 * Generate PDF CV based on template selection
 */
const generateCV = async (req, res) => {
    try {
        const { templateId = "modern", ...cvData } = req.body;
        // Direct use of body data - no DB fetch required
        if (!cvData || !cvData.personalInfo) {
            return res.status(400).json({ message: "CV data is missing in request body." });
        }
        let htmlContent = "";
        switch (templateId) {
            case "minimalist":
                htmlContent = (0, cvTemplates_1.minimalistTemplate)(cvData);
                break;
            case "advanced":
                htmlContent = (0, cvTemplates_1.advancedTemplate)(cvData);
                break;
            case "modern":
            default:
                htmlContent = (0, cvTemplates_1.modernTemplate)(cvData);
                break;
        }
        const pdfBuffer = await pdfService_1.PDFService.generateFromHtml(htmlContent);
        res.contentType("application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${cvData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_CV.pdf"`);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error("PDF generation error:", error);
        res.status(500).json({ message: "Failed to generate PDF. " + error.message });
    }
};
exports.generateCV = generateCV;
