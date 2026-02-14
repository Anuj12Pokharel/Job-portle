import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

interface Props {
    data: {
        personalInfo: {
            fullName: string;
            email: string;
            phone: string;
            address: string;
            summary: string;
        };
        experience: Array<{
            company: string;
            role: string;
            duration: string;
            responsibilities: string;
        }>;
        education: Array<{
            degree: string;
            institution: string;
            startYear: string;
            endYear: string;
        }>;
        skills: Array<{ name: string; level: number } | string>;
        languages?: Array<{ name: string; level: number }>;
        projects: Array<{
            name: string;
            description: string;
            link: string;
        }>;
        references?: Array<{
            name: string;
            company: string;
            email: string;
            phone: string;
        }>;
    };
    onChange: (newData: any) => void;
}

const CVForm: React.FC<Props> = ({ data, onChange }) => {
    const [skillInput, setSkillInput] = useState("");
    const [skillLevel, setSkillLevel] = useState(5);
    const [langInput, setLangInput] = useState("");
    const [langLevel, setLangLevel] = useState(5);
    const handleChange = (section: string, field: string, value: any, index?: number) => {
        const newData = { ...data };
        if (index !== undefined && Array.isArray(newData[section as keyof typeof data])) {
            const sectionKey = section as keyof typeof data;
            const newArray = [...(newData[sectionKey] as any[])];
            newArray[index] = { ...newArray[index], [field]: value };
            (newData as any)[sectionKey] = newArray;
        } else if (section === "personalInfo") {
            newData.personalInfo = { ...newData.personalInfo, [field]: value };
        } else {
            (newData as any)[section] = value;
        }
        onChange(newData);
    };

    const addItem = (section: string, item: any) => {
        const newData = { ...data };
        (newData as any)[section] = [...((newData as any)[section] || []), item];
        onChange(newData);
    };

    const removeItem = (section: string, index: number) => {
        const newData = { ...data };
        (newData as any)[section] = (newData as any)[section].filter((_: any, i: number) => i !== index);
        onChange(newData);
    };

    return (
        <div className="space-y-8 h-full overflow-y-auto pr-4">
            {/* Personal Info */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.personalInfo.fullName}
                        onChange={(e) => handleChange("personalInfo", "fullName", e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.personalInfo.email}
                        onChange={(e) => handleChange("personalInfo", "email", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.personalInfo.phone}
                        onChange={(e) => handleChange("personalInfo", "phone", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.personalInfo.address}
                        onChange={(e) => handleChange("personalInfo", "address", e.target.value)}
                    />
                    <textarea
                        placeholder="Professional Summary"
                        className="w-full p-2 border rounded-lg md:col-span-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.personalInfo.summary}
                        onChange={(e) => handleChange("personalInfo", "summary", e.target.value)}
                    />
                </div>
            </section>

            {/* Experience */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                    <button
                        onClick={() => addItem("experience", { company: "", role: "", duration: "", responsibilities: "" })}
                        className="text-blue-600 flex items-center gap-1 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Experience
                    </button>
                </div>
                <div className="space-y-4">
                    {data.experience.map((exp: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg relative bg-gray-50/50">
                            <button
                                onClick={() => removeItem("experience", index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <input
                                    type="text"
                                    placeholder="Company"
                                    className="w-full p-2 border rounded-lg"
                                    value={exp.company}
                                    onChange={(e) => handleChange("experience", "company", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="Role"
                                    className="w-full p-2 border rounded-lg"
                                    value={exp.role}
                                    onChange={(e) => handleChange("experience", "role", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., 2020 - 2022)"
                                    className="w-full p-2 border rounded-lg"
                                    value={exp.duration}
                                    onChange={(e) => handleChange("experience", "duration", e.target.value, index)}
                                />
                                <textarea
                                    placeholder="Responsibilities"
                                    className="w-full p-2 border rounded-lg md:col-span-2 h-20"
                                    value={exp.responsibilities}
                                    onChange={(e) => handleChange("experience", "responsibilities", e.target.value, index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                    <button
                        onClick={() => addItem("education", { degree: "", institution: "", startYear: "", endYear: "" })}
                        className="text-blue-600 flex items-center gap-1 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Education
                    </button>
                </div>
                <div className="space-y-4">
                    {data.education.map((edu: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg relative bg-gray-50/50">
                            <button
                                onClick={() => removeItem("education", index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    className="w-full p-2 border rounded-lg"
                                    value={edu.degree}
                                    onChange={(e) => handleChange("education", "degree", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    className="w-full p-2 border rounded-lg"
                                    value={edu.institution}
                                    onChange={(e) => handleChange("education", "institution", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="Start Year"
                                    className="w-full p-2 border rounded-lg"
                                    value={edu.startYear}
                                    onChange={(e) => handleChange("education", "startYear", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="End Year"
                                    className="w-full p-2 border rounded-lg"
                                    value={edu.endYear}
                                    onChange={(e) => handleChange("education", "endYear", e.target.value, index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {data.skills.map((skill: any, index: number) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {skill.name || skill} <span className="text-xs bg-blue-100 px-1 rounded">Lvl {skill.level || 5}</span>
                            <button onClick={() => removeItem("skills", index)} className="hover:text-red-500 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="5">Expert (5)</option>
                        <option value="4">Advanced (4)</option>
                        <option value="3">Intermediate (3)</option>
                        <option value="2">Beginner (2)</option>
                        <option value="1">Novice (1)</option>
                    </select>
                    <button
                        onClick={() => {
                            if (skillInput.trim()) {
                                addItem("skills", { name: skillInput.trim(), level: skillLevel });
                                setSkillInput("");
                                setSkillLevel(5);
                            }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Languages */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Languages</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {(data.languages || []).map((lang: any, index: number) => (
                        <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {lang.name} <span className="text-xs bg-green-100 px-1 rounded">Lvl {lang.level || 5}</span>
                            <button onClick={() => removeItem("languages", index)} className="hover:text-red-500 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={langInput}
                        onChange={(e) => setLangInput(e.target.value)}
                        placeholder="Add a language"
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <select
                        value={langLevel}
                        onChange={(e) => setLangLevel(parseInt(e.target.value))}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="5">Native (5)</option>
                        <option value="4">Fluent (4)</option>
                        <option value="3">Intermediate (3)</option>
                        <option value="2">Basic (2)</option>
                    </select>
                    <button
                        onClick={() => {
                            if (langInput.trim()) {
                                addItem("languages", { name: langInput.trim(), level: langLevel });
                                setLangInput("");
                                setLangLevel(5);
                            }
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Projects */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                    <button
                        onClick={() => addItem("projects", { name: "", description: "", link: "" })}
                        className="text-blue-600 flex items-center gap-1 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                </div>
                <div className="space-y-4">
                    {data.projects.map((proj: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg relative bg-gray-50/50">
                            <button
                                onClick={() => removeItem("projects", index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 gap-4 mt-2">
                                <input
                                    type="text"
                                    placeholder="Project Name"
                                    className="w-full p-2 border rounded-lg"
                                    value={proj.name}
                                    onChange={(e) => handleChange("projects", "name", e.target.value, index)}
                                />
                                <textarea
                                    placeholder="Project Description"
                                    className="w-full p-2 border rounded-lg h-20"
                                    value={proj.description}
                                    onChange={(e) => handleChange("projects", "description", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="Project Link (Optional)"
                                    className="w-full p-2 border rounded-lg"
                                    value={proj.link}
                                    onChange={(e) => handleChange("projects", "link", e.target.value, index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* References */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">References</h3>
                    <button
                        onClick={() => addItem("references", { name: "", company: "", email: "", phone: "" })}
                        className="text-blue-600 flex items-center gap-1 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Reference
                    </button>
                </div>
                <div className="space-y-4">
                    {((data.references || []) as any[]).map((ref: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg relative bg-gray-50/50">
                            <button
                                onClick={() => removeItem("references", index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <input
                                    type="text"
                                    placeholder="Reference Name"
                                    className="w-full p-2 border rounded-lg"
                                    value={ref.name}
                                    onChange={(e) => handleChange("references", "name", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="Company / Organization"
                                    className="w-full p-2 border rounded-lg"
                                    value={ref.company}
                                    onChange={(e) => handleChange("references", "company", e.target.value, index)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 border rounded-lg"
                                    value={ref.email}
                                    onChange={(e) => handleChange("references", "email", e.target.value, index)}
                                />
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="w-full p-2 border rounded-lg"
                                    value={ref.phone}
                                    onChange={(e) => handleChange("references", "phone", e.target.value, index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CVForm;