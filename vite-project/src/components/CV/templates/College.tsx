import React from "react";
import { CVData } from "../CVPreview";

const College: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white w-full min-h-[1056px] font-sans text-[13px]">
      {/* Blue top bar */}
      <div className="bg-blue-700 text-white px-10 py-7">
        <h1 className="text-3xl font-bold tracking-wide">{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-[12px] text-blue-100">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.address && <span>📍 {personalInfo.address}</span>}
        </div>
      </div>

      <div className="px-10 py-6 space-y-5 text-gray-800">
        {/* Objective / Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-sm font-bold text-blue-700 uppercase border-b-2 border-blue-200 pb-1 mb-2">Objective</h2>
            <p className="text-[12px] leading-relaxed text-gray-600">{personalInfo.summary}</p>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-700 uppercase border-b-2 border-blue-200 pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {education.map((edu: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 text-[13px]">{edu.degree}</div>
                    <div className="text-[12px] text-gray-500 italic">{edu.institution}{edu.gpa && ` — GPA: ${edu.gpa}`}</div>
                  </div>
                  <div className="text-[11px] text-gray-400 text-right whitespace-nowrap">{edu.startYear} – {edu.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements / Experience */}
        {experience?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-700 uppercase border-b-2 border-blue-200 pb-1 mb-2">Experience</h2>
            <div className="space-y-3">
              {experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">{exp.role}</span>
                    <span className="text-gray-400 text-xs">{exp.duration}</span>
                  </div>
                  <div className="text-[12px] text-gray-500 italic">{exp.company}</div>
                  {exp.responsibilities && (
                    <ul className="list-disc list-inside text-[11px] text-gray-600 mt-1 ml-3 space-y-0.5">
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

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-700 uppercase border-b-2 border-blue-200 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s: any, i: number) => (
                <span key={i} className="px-3 py-1 text-[11px] bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                  {typeof s === 'string' ? s : s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-700 uppercase border-b-2 border-blue-200 pb-1 mb-2">Projects</h2>
            <div className="space-y-2">
              {projects.map((p: any, i: number) => (
                <div key={i}>
                  <div className="font-semibold text-gray-900 text-[12px]">{p.name}</div>
                  <p className="text-[11px] text-gray-600">{p.description}</p>
                  {p.link && <a href={p.link} className="text-[11px] text-blue-600">{p.link}</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-700 uppercase border-b-2 border-blue-200 pb-1 mb-2">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((l: any, i: number) => (
                <span key={i} className="px-3 py-1 text-[11px] bg-blue-50 text-blue-800 rounded-full border border-blue-200">{l.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references?.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-blue-700 uppercase border-b-2 border-blue-200 pb-1 mb-2">References</h2>
            <div className="grid grid-cols-2 gap-3">
              {references.map((r: any, i: number) => (
                <div key={i} className="text-[11px]">
                  <div className="font-semibold text-gray-800">{r.name}</div>
                  <div className="italic text-gray-500">{r.company}</div>
                  <div className="text-gray-400">{r.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default College;
