import React, { useState } from "react";
import { toast } from "react-toastify";
import { cvApi } from "../services/cvApi";
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
    projects: []
};

const CVGenerator: React.FC = () => {
    const [cvData, setCVData] = useState(initialCVData);
    const [generating, setGenerating] = useState(false);

    const handleDownload = async () => {
        setGenerating(true);
        try {
            // Pass current cvData to generatePDF with advanced template
            const response = await cvApi.generatePDF({ ...cvData, templateId: "advanced" });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `CV_${cvData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("PDF generated successfully");
        } catch (error: any) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 mt-16">
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