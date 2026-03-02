import React from "react";
import { CVData } from "../CVPreview";

const Executive: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white w-full min-h-[1056px] font-sans text-[13px] text-gray-800">
      {/* Elegant top header */}
      <div className="px-12 py-8 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 opacity-60" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-wider uppercase">{personalInfo.fullName || "Your Name"}</h1>
          <div className="w-16 h-0.5 bg-amber-400 my-3" />
          <div className="flex flex-wrap gap-4 text-[11px] text-gray-300">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>· {personalInfo.phone}</span>}
            {personalInfo.address && <span>· {personalInfo.address}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[65%_35%]">
        {/* Main column */}
        <div className="px-10 py-6 space-y-5 border-r border-gray-200">
          {personalInfo.summary && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                <span className="w-5 h-px bg-amber-400" />Executive Summary
              </h2>
              <p className="text-[12px] leading-relaxed text-gray-600">{personalInfo.summary}</p>
            </div>
          )}

          {experience?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">
                <span className="w-5 h-px bg-amber-400" />Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900 text-[13px]">{exp.role}</span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{exp.duration}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 italic mb-1.5">{exp.company}</div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-inside text-[11px] text-gray-600 space-y-0.5 ml-3">
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

          {projects?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                <span className="w-5 h-px bg-amber-400" />Key Projects
              </h2>
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
        </div>

        {/* Sidebar */}
        <div className="px-6 py-6 space-y-5 bg-gray-50">
          {education?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Education</h2>
              <div className="space-y-2">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="font-semibold text-gray-900 text-[12px]">{edu.degree}</p>
                    <p className="text-[11px] text-gray-500 italic">{edu.institution}</p>
                    <p className="text-[10px] text-gray-400">{edu.startYear} – {edu.endYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Core Competencies</h2>
              <ul className="space-y-1">
                {skills.map((s: any, i: number) => (
                  <li key={i} className="text-[11px] text-gray-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {typeof s === 'string' ? s : s.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Languages</h2>
              <ul className="space-y-1">
                {languages.map((l: any, i: number) => (
                  <li key={i} className="text-[11px] text-gray-700">{l.name}</li>
                ))}
              </ul>
            </div>
          )}

          {references?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">References</h2>
              <div className="space-y-2">
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
    </div>
  );
};
export default Executive;
