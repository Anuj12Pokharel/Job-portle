import pdf from "html-pdf";

export class PDFService {
  /**
   * Generate PDF from HTML content
   * @param htmlContent - HTML string to convert to PDF
   * @returns Promise<Buffer> - PDF file buffer
   */
  static generateFromHtml(htmlContent: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        type: "application/pdf",
      };

      pdf.create(htmlContent, options).toBuffer((err: any, buffer: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });
  }

  /**
   * Generate PDF from HTML and save to file
   * @param htmlContent - HTML string to convert to PDF
   * @param filePath - Path where PDF should be saved
   */
  static generatePdfFile(htmlContent: string, filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        type: "application/pdf",
      };

      pdf.create(htmlContent, options).toFile(filePath, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.filename);
        }
      });
    });
  }
}
