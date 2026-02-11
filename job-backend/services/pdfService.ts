import puppeteer from "puppeteer";
import fs from "fs";

export class PDFService {
  /**
   * Generate PDF from HTML content
   * @param htmlContent - HTML string to convert to PDF
   * @returns Promise<Buffer> - PDF file buffer
   */
  static async generateFromHtml(htmlContent: string): Promise<Buffer> {
    let browser;
    try {
      browser = await puppeteer.launch({
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
    } catch (error) {
      console.error("Puppeteer error:", error);
      throw error;
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * Generate PDF from HTML and save to file
   * @param htmlContent - HTML string to convert to PDF
   * @param filePath - Path where PDF should be saved
   */
  static async generatePdfFile(htmlContent: string, filePath: string): Promise<string> {
    const buffer = await this.generateFromHtml(htmlContent);
    await fs.promises.writeFile(filePath, buffer);
    return filePath;
  }
}
