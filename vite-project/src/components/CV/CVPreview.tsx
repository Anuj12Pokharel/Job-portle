import React from "react";
import Professional2 from "./templates/Professional2";
import Professional3 from "./templates/Professional3";
import Basic from "./templates/Basic";
import College from "./templates/College";
import Modern from "./templates/Modern";
import Creative from "./templates/Creative";
import Executive from "./templates/Executive";

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary?: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    gpa?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    responsibilities?: string;
  }>;
  skills: Array<{ name: string; level: number } | string>;
  languages?: Array<{ name: string; level: number }>;
  projects: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
  references?: Array<{
    name: string;
    company: string;
    email: string;
    phone: string;
  }>;
}

export type TemplateKey = "professional" | "professional2" | "professional3" | "basic" | "college" | "modern" | "creative" | "executive";

interface Props {
  data: CVData;
  template?: TemplateKey;
}

// Inline classic "Professional" template (original)
const ProfessionalTemplate: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white shadow-2xl rounded-sm w-full min-h-[841px] p-[40px] text-gray-800 border overflow-y-auto print:shadow-none" id="cv-preview">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">{personalInfo.fullName || "Your Name"}</h1>
        <div className="text-sm text-gray-600 mt-2 flex justify-center gap-3">
          <span>{personalInfo.email || "email@example.com"}</span>
          {personalInfo.phone && (<><span>|</span><span>{personalInfo.phone}</span></>)}
        </div>
        <p className="text-sm text-gray-600 mt-1">{personalInfo.address}</p>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{personalInfo.summary}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 mb-3">Work Experience</h2>
        <div className="space-y-4">
          {experience && experience.length > 0 ? (
            experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between font-bold text-gray-800 text-sm">
                  <span>{exp.role || "Role"}</span>
                  <span className="text-gray-500 font-normal">{exp.duration}</span>
                </div>
                <div className="text-sm italic text-gray-600 mb-1">{exp.company}</div>
                {exp.responsibilities && (
                  <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 ml-2">
                    {exp.responsibilities.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                      <li key={i}>{line.trim().startsWith('•') ? line.trim().substring(1).trim() : line.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No experience added yet</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 mb-3">Education</h2>
        <div className="space-y-3">
          {education && education.length > 0 ? (
            education.map((edu: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between font-bold text-gray-800 text-sm">
                  <span>{edu.degree || "Degree"}</span>
                  <span className="text-gray-500 font-normal">{edu.startYear} - {edu.endYear}</span>
                </div>
                <div className="text-sm italic text-gray-600">
                  {edu.institution}
                  {edu.gpa && <span className="ml-2 text-gray-500 not-italic">| GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No education added yet</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 mb-2">Skills</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {skills && skills.length > 0 ? (
            skills.map((skill: any, index: number) => (
              <span key={index} className="text-sm text-gray-800">
                {typeof skill === 'string' ? skill : `${skill.name}`}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No skills added yet</p>
          )}
        </div>
      </div>

      {languages && languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 mb-2">Languages</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {languages.map((lang: any, index: number) => (
              <span key={index} className="text-sm text-gray-800">{lang.name}</span>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 mb-2">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj: any, index: number) => (
              <div key={index}>
                <h3 className="text-sm font-bold text-gray-800">{proj.name}</h3>
                <p className="text-xs text-gray-700 mt-1">{proj.description}</p>
                {proj.link && <a href={proj.link} className="text-xs text-blue-500 mt-1 hover:underline" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {references && references.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 uppercase border-b border-gray-200 mb-2">References</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {references.map((ref: any, index: number) => (
              <div key={index} className="text-sm">
                <div className="font-bold text-gray-800">{ref.name}</div>
                <div className="italic text-gray-600">{ref.company}</div>
                <div className="text-xs text-gray-500 mt-1">{ref.email} | {ref.phone}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CVPreview: React.FC<Props> = ({ data, template = "professional" }) => {
  switch (template) {
    case "professional2":  return <Professional2 data={data} />;
    case "professional3":  return <Professional3 data={data} />;
    case "basic":          return <Basic data={data} />;
    case "college":        return <College data={data} />;
    case "modern":         return <Modern data={data} />;
    case "creative":       return <Creative data={data} />;
    case "executive":      return <Executive data={data} />;
    default:
      return (
        <div id="cv-preview">
          <ProfessionalTemplate data={data} />
        </div>
      );
  }
};

export default CVPreview;