import { Request, Response } from "express";
import User, { ICVData } from "../models/User";
import { PDFService } from "../services/pdfService";
import { minimalistTemplate, modernTemplate, advancedTemplate } from "../templates/cvTemplates";

/**
 * Get CV data for the authenticated user
 */
export const getCVData = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.cvData || {});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update CV data for the authenticated user
 */
export const updateCVData = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: { cvData: req.body } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.cvData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Generate PDF CV based on template selection
 */
export const generateCV = async (req: Request, res: Response) => {
  try {
    const { templateId = "modern", ...cvData } = req.body;

    // Direct use of body data - no DB fetch required
    if (!cvData || !cvData.personalInfo) {
      return res.status(400).json({ message: "CV data is missing in request body." });
    }

    let htmlContent = "";

    switch (templateId) {
      case "minimalist":
        htmlContent = minimalistTemplate(cvData);
        break;
      case "advanced":
        htmlContent = advancedTemplate(cvData);
        break;
      case "modern":
      default:
        htmlContent = modernTemplate(cvData);
        break;
    }

    const pdfBuffer = await PDFService.generateFromHtml(htmlContent);

    res.contentType("application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${cvData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_CV.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate PDF. " + error.message });
  }
};
