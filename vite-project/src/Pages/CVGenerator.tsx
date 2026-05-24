import React, { useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CVForm from "../components/CV/CVForm";
import CVPreview, { TemplateKey } from "../components/CV/CVPreview";
import { Download, Loader2, LayoutTemplate, ArrowLeft, CheckCircle2 } from "lucide-react";

const initialCVData = {
    personalInfo: { fullName: "", email: "", phone: "", address: "", summary: "" },
    education: [],
    experience: [],
    skills: [],
    languages: [],
    projects: [],
    references: []
};

// Demo data for thumbnail previews so they don't look empty
const demoData = {
    personalInfo: {
        fullName: "John Kumar Doe",
        email: "john.doe@email.com",
        phone: "+977 9812345678",
        address: "Kathmandu, Nepal",
        summary: "Experienced product manager with 5+ years delivering results."
    },
    education: [
        { degree: "Bachelor of Computer Science", institution: "Tribhuvan University", startYear: "2016", endYear: "2020", gpa: "3.8" }
    ],
    experience: [
        { company: "Tech Corp Nepal", role: "Senior Developer", duration: "2021 – Present", responsibilities: "Led development team of 8\nImproved performance by 40%\nDelivered 12 projects on time" },
        { company: "StartupXYZ", role: "Frontend Developer", duration: "2020 – 2021", responsibilities: "Built React dashboards\nIntegrated REST APIs" }
    ],
    skills: [
        { name: "React", level: 5 }, { name: "TypeScript", level: 4 }, { name: "Node.js", level: 4 },
        { name: "SQL", level: 3 }, { name: "Python", level: 3 }
    ],
    languages: [
        { name: "English", level: 5 }, { name: "Nepali", level: 5 }, { name: "Hindi", level: 3 }
    ],
    projects: [
        { name: "JobLink360 Portal", description: "Full-stack job portal with real-time notifications", link: "" },
        { name: "CV Generator", description: "React app for generating professional CVs", link: "" }
    ],
    references: [
        { name: "Ram Sharma", company: "Tech Corp", email: "ram@techcorp.com", phone: "9800000001" }
    ]
};

const TEMPLATES: { key: TemplateKey; label: string; color: string }[] = [
    { key: "professional",  label: "Professional",   color: "#374151" },
    { key: "professional2", label: "Professional 2", color: "#1f2937" },
    { key: "professional3", label: "Professional 3", color: "#1f2937" },
    { key: "basic",         label: "Basic",          color: "#64748b" },
    { key: "college",       label: "College",        color: "#1d4ed8" },
    { key: "modern",        label: "Modern",         color: "#0f172a" },
    { key: "creative",      label: "Creative",       color: "#7e22ce" },
    { key: "executive",     label: "Executive",      color: "#111827" },
];

const CVGenerator: React.FC = () => {
    const [cvData, setCVData] = useState(initialCVData);
    const [generating, setGenerating] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("professional");
    const [showTemplatePicker, setShowTemplatePicker] = useState(false);
    const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

    const handleDownload = async () => {
        const previewEl = document.getElementById("cv-preview");
        if (!previewEl) {
            toast.error("CV preview not found. Please fill in your details first.");
            return;
        }
        setGenerating(true);
        try {
            const canvas = await html2canvas(previewEl, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const ratio = pdfWidth / canvas.width;
            let scaledHeight = canvas.height * ratio;
            
            // Limit to maximum 2 pages
            const maxPages = 2;
            
            let yOffset = 0;
            for (let i = 0; i < maxPages; i++) {
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, scaledHeight);
                yOffset += pdfHeight;
                
                // If we've covered the entire content, stop adding pages
                if (yOffset >= scaledHeight) break;
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

    const handleSelectTemplate = (key: TemplateKey) => {
        setSelectedTemplate(key);
        setShowTemplatePicker(false);
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 mt-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">CV Generator</h1>
                    <p className="text-gray-500 mt-1">
                        {showTemplatePicker
                            ? "Select a template that best suits your resume."
                            : "Fill in your details and preview your professional CV in real-time."}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowTemplatePicker(v => !v)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition shadow-sm border ${
                            showTemplatePicker
                                ? "bg-teal-600 text-white border-teal-600"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {showTemplatePicker ? <ArrowLeft className="w-4 h-4" /> : <LayoutTemplate className="w-4 h-4" />}
                        {showTemplatePicker ? "Back to Form" : "Templates"}
                    </button>
                </div>
            </div>

            {/* Fixed Generate PDF Button */}
            <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Ready to download?</span>{" "}
                    Make sure all required fields are filled.
                </p>
                <button
                    onClick={handleDownload}
                    disabled={generating}
                    className="flex items-center gap-2 bg-teal-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 shadow-lg shadow-teal-200"
                >
                    {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    {generating ? "Generating..." : "Generate PDF"}
                </button>
            </div>

            {/* Tab Selector for Mobile (Visible only on screens smaller than lg) */}
            {!showTemplatePicker && (
                <div className="flex lg:hidden mb-6 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                    <button
                        onClick={() => setActiveTab("form")}
                        className={`flex-1 py-2.5 text-center font-bold text-sm rounded-lg transition-all ${
                            activeTab === "form"
                                ? "bg-white text-teal-700 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Edit Details
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex-1 py-2.5 text-center font-bold text-sm rounded-lg transition-all ${
                            activeTab === "preview"
                                ? "bg-white text-teal-700 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Live Preview
                    </button>
                </div>
            )}

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-230px)]">

                {/* LEFT: Form OR Template Picker */}
                <div className={`overflow-y-auto rounded-xl border border-gray-200 bg-white ${
                    showTemplatePicker || activeTab === "form" ? "block" : "hidden lg:block"
                }`}>
                    {showTemplatePicker ? (
                        /* ---- Template Picker Panel ---- */
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Select Template</h2>
                            <p className="text-sm text-gray-500 mb-5">Feel free to choose a template you believe best suits your resume.</p>
                            <div className="grid grid-cols-2 gap-5">
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.key}
                                        onClick={() => handleSelectTemplate(t.key)}
                                        className={`relative group flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                                            selectedTemplate === t.key
                                                ? "border-teal-500 shadow-lg shadow-teal-100"
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                    >
                                        {/* Scaled-down real template preview */}
                                        <div className="w-full bg-gray-50 overflow-hidden" style={{ height: '220px' }}>
                                            <div style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: '285.7%', pointerEvents: 'none' }}>
                                                <CVPreview data={demoData} template={t.key} />
                                            </div>
                                        </div>
                                        {/* Label */}
                                        <div className={`w-full px-3 py-2 text-sm font-semibold flex items-center justify-between ${
                                            selectedTemplate === t.key ? "bg-teal-50 text-teal-700" : "bg-white text-gray-700"
                                        }`}>
                                            <span>{t.label}</span>
                                            {selectedTemplate === t.key && (
                                                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ---- CV Form ---- */
                        <CVForm data={cvData} onChange={setCVData} />
                    )}
                </div>

                {/* RIGHT: CV Preview */}
                <div className={`bg-gray-100 p-4 lg:p-6 rounded-xl overflow-y-auto ${
                    !showTemplatePicker && activeTab === "preview" ? "block" : "hidden lg:block"
                }`}>
                    <div id="cv-preview" className="max-w-[800px] mx-auto scale-95 origin-top bg-white p-4 pb-12 shadow-sm overflow-x-auto">
                        <CVPreview data={cvData} template={selectedTemplate} />
                        {/* Branding Footer */}
                        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-400 italic">
                                Generated by <span className="font-semibold text-teal-600">Hamro Job Pvt. Ltd.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVGenerator;