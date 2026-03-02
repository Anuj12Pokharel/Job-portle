import React from "react";
import { CVData } from "../CVPreview";

const Professional2: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white w-full min-h-[1056px] font-sans text-gray-800 text-[13px]" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div className="text-center py-8 border-b-2 border-gray-700">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-900">{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex justify-center flex-wrap gap-3 mt-2 text-xs text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.address && <><span>|</span><span>{personalInfo.address}</span></>}
        </div>
      </div>

      <div className="px-10 py-6 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-1 mb-2">Summary</h2>
            <p className="text-[12px] leading-relaxed text-gray-700">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-1 mb-3">Work Experience</h2>
            <div className="space-y-4">
              {experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">{exp.role}</span>
                    <span className="text-gray-500 text-xs">{exp.duration}</span>
                  </div>
                  <div className="italic text-[12px] text-gray-600 mb-1">{exp.company}</div>
                  {exp.responsibilities && (
                    <ul className="list-disc list-inside text-[11px] text-gray-700 space-y-0.5 ml-3">
                      {exp.responsibilities.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                        <li key={j}>{line.trim().replace(/^•\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-1 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">{edu.degree}</span>
                    <span className="text-gray-500 text-xs">{edu.startYear} – {edu.endYear}</span>
                  </div>
                  <div className="italic text-[12px] text-gray-600">{edu.institution}{edu.gpa && ` | GPA: ${edu.gpa}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {skills.map((s: any, i: number) => (
                <span key={i} className="text-[12px] text-gray-700">{typeof s === 'string' ? s : s.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-1 mb-2">Projects</h2>
            <div className="space-y-2">
              {projects.map((p: any, i: number) => (
                <div key={i}>
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  <p className="text-[11px] text-gray-600">{p.description}</p>
                  {p.link && <a href={p.link} className="text-[11px] text-blue-600 hover:underline">{p.link}</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b border-gray-700 pb-1 mb-2">Languages</h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((l: any, i: number) => (
                <span key={i} className="text-[12px]">{l.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Professional2;
