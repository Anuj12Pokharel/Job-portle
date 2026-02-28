import React, { useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CVForm from "../components/CV/CVForm";
import CVPreview from "../components/CV/CVPreview";
import { Download, Loader2 } from "lucide-react";

const initialCVData = {
    personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        summary: ""
    },
    education: [],
    experience: [],
    skills: [],
    languages: [],
    projects: [],
    references: []
};

const CVGenerator: React.FC = () => {
    const [cvData, setCVData] = useState(initialCVData);
    const [generating, setGenerating] = useState(false);

    const handleDownload = async () => {
        const previewEl = document.getElementById("cv-preview");
        if (!previewEl) {
            toast.error("CV preview not found. Please fill in your details first.");
            return;
        }

        setGenerating(true);
        try {
            const canvas = await html2canvas(previewEl, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio = pdfWidth / imgWidth;
            const scaledHeight = imgHeight * ratio;

            // Multi-page support
            let yOffset = 0;
            while (yOffset < scaledHeight) {
                if (yOffset > 0) pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, scaledHeight);
                yOffset += pdfHeight;
            }

            const fileName = `CV_${cvData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`;
            pdf.save(fileName);
            toast.success("PDF generated successfully!");
        } catch (error: any) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 mt-24">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">CV Generator</h1>
                    <p className="text-gray-500">Fill in your details and preview your professional CV in real-time.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={generating}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        Generate PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
                {/* Left: Form */}
                <div className="overflow-hidden">
                    <CVForm data={cvData} onChange={setCVData} />
                </div>

                {/* Right: Preview */}
                <div className="hidden lg:block bg-gray-100 p-8 rounded-xl overflow-y-auto">
                    <div className="max-w-[800px] mx-auto scale-95 origin-top">
                        <CVPreview data={cvData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVGenerator;