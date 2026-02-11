"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
class PDFService {
    /**
     * Generate PDF from HTML content
     * @param htmlContent - HTML string to convert to PDF
     * @returns Promise<Buffer> - PDF file buffer
     */
    static async generateFromHtml(htmlContent) {
        let browser;
        try {
            browser = await puppeteer_1.default.launch({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu"
                ],
                // Use installed chromium in Docker, or default in local
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
            });
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: "networkidle0" });
            const buffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: "10mm",
                    bottom: "10mm",
                    left: "10mm",
                    right: "10mm"
                }
            });
            return Buffer.from(buffer);
        }
        catch (error) {
            console.error("Puppeteer error:", error);
            throw error;
        }
        finally {
            if (browser)
                await browser.close();
        }
    }
    /**
     * Generate PDF from HTML and save to file
     * @param htmlContent - HTML string to convert to PDF
     * @param filePath - Path where PDF should be saved
     */
    static async generatePdfFile(htmlContent, filePath) {
        const buffer = await this.generateFromHtml(htmlContent);
        await fs_1.default.promises.writeFile(filePath, buffer);
        return filePath;
    }
}
exports.PDFService = PDFService;
