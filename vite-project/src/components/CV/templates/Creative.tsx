import React from "react";
import { CVData } from "../CVPreview";

const Creative: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white w-full min-h-[1056px] font-sans text-[13px]">
      {/* Header - two tone */}
      <div className="flex">
        {/* Purple left accent */}
        <div className="w-[40%] bg-purple-700 text-white p-7 flex flex-col justify-end min-h-[160px]">
          <h1 className="text-2xl font-bold leading-tight uppercase tracking-wide">{personalInfo.fullName || "Your Name"}</h1>
        </div>
        {/* Contact right */}
        <div className="flex-1 bg-purple-50 p-7 flex flex-col justify-end">
          <div className="space-y-1 text-[11px] text-purple-800">
            {personalInfo.email && <p><span className="font-semibold">Email:</span> {personalInfo.email}</p>}
            {personalInfo.phone && <p><span className="font-semibold">Phone:</span> {personalInfo.phone}</p>}
            {personalInfo.address && <p><span className="font-semibold">Address:</span> {personalInfo.address}</p>}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left column */}
        <div className="w-[40%] bg-purple-700 text-white p-7 space-y-5 min-h-[896px]">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1">Profile</h2>
              <p className="text-[11px] text-purple-100 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-2">Skills</h2>
              <ul className="space-y-1.5">
                {skills.map((s: any, i: number) => {
                  const name = typeof s === 'string' ? s : s.name;
                  const level = typeof s === 'string' ? 3 : (s.level || 3);
                  return (
                    <li key={i} className="text-[11px]">
                      <div className="flex justify-between text-purple-100 mb-0.5">
                        <span>{name}</span>
                        <span className="text-purple-300">{level * 20}%</span>
                      </div>
                      <div className="w-full bg-purple-800 rounded-full h-1">
                        <div className="bg-purple-300 h-1 rounded-full" style={{ width: `${level * 20}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-2">Languages</h2>
              <ul className="space-y-1">
                {languages.map((l: any, i: number) => (
                  <li key={i} className="text-[11px] text-purple-100 flex justify-between">
                    <span>{l.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-2">Education</h2>
              <div className="space-y-2">
                {education.map((edu: any, i: number) => (
                  <div key={i}>
                    <p className="text-[11px] font-semibold text-white">{edu.degree}</p>
                    <p className="text-[10px] text-purple-300">{edu.institution}</p>
                    <p className="text-[10px] text-purple-400">{edu.startYear} – {edu.endYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 p-7 space-y-5">
          {/* Experience */}
          {experience?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-700 border-b-2 border-purple-200 pb-1 mb-3">Experience</h2>
              <div className="space-y-4">
                {experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-gray-900 text-[13px]">{exp.role}</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{exp.duration}</span>
                    </div>
                    <div className="text-[11px] text-purple-600 italic mb-1">{exp.company}</div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-inside text-[11px] text-gray-600 ml-2 space-y-0.5">
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
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-700 border-b-2 border-purple-200 pb-1 mb-2">Projects</h2>
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

          {/* Awards / References */}
          {references?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-700 border-b-2 border-purple-200 pb-1 mb-2">References</h2>
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
    </div>
  );
};
export default Creative;
