import React from "react";
import { CVData } from "../CVPreview";

const Basic: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white w-full min-h-[1056px] font-sans text-[13px] px-10 py-8 text-gray-800">
      {/* Name */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">{personalInfo.fullName || "Your Name"}</h1>
        <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>· {personalInfo.phone}</span>}
          {personalInfo.address && <span>· {personalInfo.address}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-5">
          <p className="text-[12px] text-gray-600 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {experience?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b pb-1">Experience</h2>
          <div className="space-y-3">
            {experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-[13px]">
                  <span className="font-semibold text-gray-900">{exp.role}, <span className="font-normal text-gray-600">{exp.company}</span></span>
                  <span className="text-gray-400 text-xs">{exp.duration}</span>
                </div>
                {exp.responsibilities && (
                  <ul className="list-disc list-inside text-[11px] text-gray-600 mt-1 space-y-0.5 ml-2">
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

      {education?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b pb-1">Education</h2>
          <div className="space-y-2">
            {education.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between text-[12px]">
                <span><span className="font-semibold text-gray-900">{edu.degree}</span>, <span className="text-gray-600">{edu.institution}</span></span>
                <span className="text-gray-400 text-xs">{edu.startYear} – {edu.endYear}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b pb-1">Skills</h2>
          <p className="text-[12px] text-gray-700">{skills.map((s: any) => typeof s === 'string' ? s : s.name).join(' · ')}</p>
        </div>
      )}

      {languages?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b pb-1">Languages</h2>
          <p className="text-[12px] text-gray-700">{languages.map((l: any) => l.name).join(' · ')}</p>
        </div>
      )}

      {projects?.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b pb-1">Projects</h2>
          <div className="space-y-2">
            {projects.map((p: any, i: number) => (
              <div key={i}>
                <span className="font-semibold text-[12px] text-gray-900">{p.name}</span>
                <p className="text-[11px] text-gray-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {references?.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b pb-1">References</h2>
          <div className="grid grid-cols-2 gap-3">
            {references.map((r: any, i: number) => (
              <div key={i} className="text-[11px] text-gray-600">
                <div className="font-semibold text-gray-800">{r.name}</div>
                <div className="italic">{r.company}</div>
                <div>{r.email} · {r.phone}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Basic;
