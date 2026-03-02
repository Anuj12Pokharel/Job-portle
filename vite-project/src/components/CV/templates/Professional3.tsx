import React from "react";
import { CVData } from "../CVPreview";

const Professional3: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white w-full min-h-[1056px] font-sans text-[13px]">
      {/* Two-column layout */}
      <div className="flex h-full">
        {/* Left sidebar */}
        <div className="w-[35%] bg-gray-800 text-white p-6 min-h-[1056px] space-y-5">
          {/* Name */}
          <div className="border-b border-gray-600 pb-4">
            <h1 className="text-xl font-bold leading-tight uppercase tracking-wide">{personalInfo.fullName || "Your Name"}</h1>
          </div>
          {/* Contact */}
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Contact</h2>
            <div className="space-y-1 text-[11px] text-gray-300">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.address && <p>{personalInfo.address}</p>}
            </div>
          </div>
          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
              <ul className="space-y-1">
                {skills.map((s: any, i: number) => (
                  <li key={i} className="text-[11px] text-gray-200 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-teal-400 inline-block flex-shrink-0"></span>
                    {typeof s === 'string' ? s : s.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Languages */}
          {languages?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Languages</h2>
              <ul className="space-y-1">
                {languages.map((l: any, i: number) => (
                  <li key={i} className="text-[11px] text-gray-200">{l.name}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Education</h2>
              <div className="space-y-2">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="text-[11px] font-semibold text-white">{edu.degree}</p>
                    <p className="text-[10px] text-gray-400">{edu.institution}</p>
                    <p className="text-[10px] text-gray-500">{edu.startYear} – {edu.endYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main content */}
        <div className="flex-1 p-7 space-y-5">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b-2 border-gray-800 pb-1 mb-2">Summary</h2>
              <p className="text-[12px] leading-relaxed text-gray-600">{personalInfo.summary}</p>
            </div>
          )}
          {/* Experience */}
          {experience?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b-2 border-gray-800 pb-1 mb-3">Experience</h2>
              <div className="space-y-4">
                {experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-gray-900 text-[13px]">{exp.role}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{exp.duration}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 italic mb-1">{exp.company}</div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-inside text-[11px] text-gray-600 space-y-0.5 ml-2">
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
          {/* Projects */}
          {projects?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b-2 border-gray-800 pb-1 mb-2">Projects</h2>
              <div className="space-y-2">
                {projects.map((p: any, i: number) => (
                  <div key={i}>
                    <span className="font-semibold text-gray-900 text-[12px]">{p.name}</span>
                    <p className="text-[11px] text-gray-600">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* References */}
          {references?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 border-b-2 border-gray-800 pb-1 mb-2">References</h2>
              <div className="grid grid-cols-2 gap-3">
                {references.map((r: any, i: number) => (
                  <div key={i} className="text-[11px]">
                    <div className="font-semibold text-gray-800">{r.name}</div>
                    <div className="text-gray-500 italic">{r.company}</div>
                    <div className="text-gray-400">{r.email}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Professional3;
