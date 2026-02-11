import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { cvApi } from "../services/cvApi";
import CVForm from "../components/CV/CVForm";
import CVPreview from "../components/CV/CVPreview";
import { Download, Save, Loader2 } from "lucide-react";

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
    projects: []
};

const CVGenerator: React.FC = () => {
    const [cvData, setCVData] = useState(initialCVData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchCVData();
    }, []);

    const fetchCVData = async () => {
        try {
            const response = await cvApi.getCVProfile();
            if (response.data && response.data.personalInfo) {
                setCVData(response.data);
            }
        } catch (error: any) {
            console.error("Error fetching CV data:", error);
            toast.error("Failed to load CV data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await cvApi.updateCVProfile(cvData);
            toast.success("CV data saved successfully");
        } catch (error: any) {
            console.error("Error saving CV data:", error);
            toast.error("Failed to save CV data");
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        setGenerating(true);
        try {
            const response = await cvApi.generatePDF();

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 mt-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">CV Generator</h1>
                    <p className="text-gray-500">Fill in your details and preview your professional CV in real-time.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-white text-blue-600 border border-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Data
                    </button>
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