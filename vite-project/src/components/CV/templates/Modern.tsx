import React from "react";
import { CVData } from "../CVPreview";

// Dot level indicator
const DotLevel: React.FC<{ level: number }> = ({ level }) => (
  <div className="flex gap-0.5 mt-0.5">
    {[1,2,3,4,5].map(i => (
      <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? 'bg-teal-400' : 'bg-gray-300'}`} />
    ))}
  </div>
);

const Modern: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, education, experience, skills, projects, languages, references } = data;
  return (
    <div className="bg-white w-full min-h-[1056px] font-sans text-[13px] flex">
      {/* LEFT sidebar */}
      <div className="w-[38%] bg-slate-800 text-white p-7 space-y-6 min-h-[1056px]">
        {/* Avatar placeholder */}
        <div className="flex flex-col items-center pb-5 border-b border-slate-600">
          <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-2xl font-bold text-white mb-3 ring-4 ring-teal-400/30">
            {(personalInfo.fullName || "U").charAt(0).toUpperCase()}
          </div>
          <h1 className="text-lg font-bold text-center uppercase tracking-wide leading-tight">{personalInfo.fullName || "Your Name"}</h1>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-2">Contact</h2>
          <div className="space-y-1 text-[11px] text-slate-300 break-all">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-2">Skills</h2>
            <div className="space-y-2">
              {skills.map((s: any, i: number) => {
                const name = typeof s === 'string' ? s : s.name;
                const level = typeof s === 'string' ? 3 : (s.level || 3);
                return (
                  <div key={i}>
                    <p className="text-[11px] text-slate-200">{name}</p>
                    <DotLevel level={level} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-2">Languages</h2>
            <div className="space-y-2">
              {languages.map((l: any, i: number) => (
                <div key={i}>
                  <p className="text-[11px] text-slate-200">{l.name}</p>
                  <DotLevel level={l.level || 3} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-2">Education</h2>
            <div className="space-y-3">
              {education.map((edu: any, i: number) => (
                <div key={i}>
                  <p className="text-[11px] font-semibold text-white">{edu.degree}</p>
                  <p className="text-[10px] text-slate-400">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500">{edu.startYear} – {edu.endYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT main */}
      <div className="flex-1 p-7 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 border-b-2 border-teal-200 pb-1 mb-2">About Me</h2>
            <p className="text-[12px] leading-relaxed text-gray-600">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 border-b-2 border-teal-200 pb-1 mb-3">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp: any, i: number) => (
                <div key={i} className="pl-3 border-l-2 border-teal-300">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 text-[13px]">{exp.role}</span>
                    <span className="text-[10px] text-gray-400">{exp.duration}</span>
                  </div>
                  <div className="text-[11px] text-teal-600 italic mb-1">{exp.company}</div>
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

        {/* Achievements / Projects */}
        {projects?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 border-b-2 border-teal-200 pb-1 mb-2">Achievements</h2>
            <div className="space-y-2">
              {projects.map((p: any, i: number) => (
                <div key={i} className="pl-3 border-l-2 border-teal-100">
                  <span className="font-semibold text-[12px] text-gray-900">{p.name}</span>
                  <p className="text-[11px] text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {references?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 border-b-2 border-teal-200 pb-1 mb-2">References</h2>
            <div className="grid grid-cols-2 gap-3">
              {references.map((r: any, i: number) => (
                <div key={i} className="text-[11px]">
                  <div className="font-semibold">{r.name}</div>
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
export default Modern;
