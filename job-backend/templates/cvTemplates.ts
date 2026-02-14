
export const minimalistTemplate = (data: any) => {
  const { personalInfo, education, experience, skills } = data;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.4; color: #000; padding: 50px; }
        .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 2.5rem; letter-spacing: 2px; }
        .contact { margin-top: 10px; font-size: 0.9rem; }
        .section { margin-bottom: 30px; }
        .section-title { font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 15px; padding-bottom: 5px; }
        .item { margin-bottom: 20px; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 5px; }
        .skill-tag { border: 1px solid #000; padding: 2px 8px; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personalInfo.fullName}</h1>
        <div class="contact">${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.address}</div>
      </div>
      ${personalInfo.summary ? `<div class="section"><div class="section-title">Summary</div><p>${personalInfo.summary}</p></div>` : ""}
      <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((exp: any) => `
          <div class="item">
            <div class="item-header"><span>${exp.company}</span><span>${exp.duration}</span></div>
            <div style="font-style:italic">${exp.role}</div>
            <div style="margin-top:5px; font-size:0.9rem">${(exp.responsibilities || "").split('\n').map((l: string) => `• ${l}`).join('<br>')}</div>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <div class="section-title">Education</div>
        ${education.map((edu: any) => `
          <div class="item">
            <div class="item-header"><span>${edu.institution}</span><span>${edu.startYear} - ${edu.endYear}</span></div>
            <div>${edu.degree}</div>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">${skills.map((s: string) => `<span class="skill-tag">${s}</span>`).join('')}</div>
      </div>
    </body>
    </html>
  `;
};

export const modernTemplate = (data: any) => {
  const { personalInfo, education, experience, skills, projects } = data;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; padding: 40px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #007bff; text-transform: uppercase; }
        .header p { margin: 5px 0; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 1.2rem; font-weight: bold; color: #007bff; border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 5px; text-transform: uppercase; }
        .item { margin-bottom: 15px; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; }
        .item-sub { font-style: italic; color: #555; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; }
        .skill-tag { background: #f0f0f0; padding: 5px 10px; border-radius: 4px; font-size: 0.9rem; }
        .responsibilities { margin-top: 5px; padding-left: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personalInfo.fullName}</h1>
        <p>${personalInfo.email} | ${personalInfo.phone}</p>
        <p>${personalInfo.address}</p>
      </div>
      ${personalInfo.summary ? `<div class="section"><div class="section-title">Professional Summary</div><p>${personalInfo.summary}</p></div>` : ""}
      <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((exp: any) => `
          <div class="item">
            <div class="item-header"><span>${exp.role}</span><span>${exp.duration}</span></div>
            <div class="item-sub">${exp.company}</div>
            <div class="responsibilities">${(exp.responsibilities || "").split('\n').map((line: string) => `• ${line}`).join('<br>')}</div>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <div class="section-title">Education</div>
        ${education.map((edu: any) => `
          <div class="item">
            <div class="item-header"><span>${edu.degree}</span><span>${edu.startYear} - ${edu.endYear}</span></div>
            <div class="item-sub">${edu.institution}</div>
          </div>
        `).join('')}
      </div>
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">${skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}</div>
      </div>
      ${projects && projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projects.map((proj: any) => `
            <div class="item">
              <div class="item-header"><span>${proj.name}</span></div>
              <p>${proj.description}</p>
              ${proj.link ? `<a href="${proj.link}">${proj.link}</a>` : ""}
            </div>
          `).join('')}
        </div>
      ` : ""}
    </body>
    </html>
  `;
};

export const advancedTemplate = (data: any) => {
  const { personalInfo, education, experience, skills, languages, references, projects } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        body { 
            font-family: 'Roboto', Helvetica, Arial, sans-serif; 
            line-height: 1.5; 
            color: #1f2937; /* gray-800 */
            padding: 40px; 
            max-width: 210mm;
            margin: 0 auto;
            background: white;
        }
        
        .header { 
            text-align: center; 
            border-bottom: 2px solid #2563eb; /* primary-blue / blue-600 */
            padding-bottom: 16px; 
            margin-bottom: 24px; 
        }
        
        .header h1 { 
            font-size: 1.875rem; /* text-3xl */
            font-weight: 700; 
            color: #111827; /* gray-900 */
            text-transform: uppercase; 
            letter-spacing: 0.05em; /* tracking-wider */
            margin: 0;
        }
        
        .contact-info { 
            font-size: 0.875rem; /* text-sm */
            color: #4b5563; /* gray-600 */
            margin-top: 8px; 
            display: flex; 
            justify-content: center; 
            gap: 12px; 
        }
        
        .address {
            font-size: 0.875rem; /* text-sm */
            color: #4b5563; /* gray-600 */
            margin-top: 4px;
        }
        
        .section { margin-bottom: 24px; }
        
        .section-title { 
            font-size: 1.125rem; /* text-lg */
            font-weight: 700; 
            color: #2563eb; /* blue-600 */
            text-transform: uppercase; 
            border-bottom: 1px solid #e5e7eb; /* border-gray-200 */
            margin-bottom: 8px; /* mb-2 */
            padding-bottom: 2px;
        }
        
        .summary-text {
            font-size: 0.875rem; /* text-sm */
            line-height: 1.625; /* leading-relaxed */
            color: #374151; /* text-gray-700 */
        }

        .item { margin-bottom: 12px; }
        
        .item-header { 
            display: flex; 
            justify-content: space-between; 
            font-weight: 700; 
            font-size: 0.875rem; /* text-sm */
            color: #1f2937; /* gray-800 */
        }
        
        .item-date {
            font-weight: 400;
            color: #6b7280; /* text-gray-500 */
        }
        
        .item-subtitle { 
            font-size: 0.875rem; /* text-sm */
            font-style: italic; 
            color: #4b5563; /* text-gray-600 */
            margin-bottom: 4px; 
        }
        
        .responsibilities ul {
            list-style-type: disc;
            list-style-position: inside;
            font-size: 0.75rem; /* text-xs */
            color: #374151; /* text-gray-700 */
            margin-left: 8px;
            padding: 0;
        }
        
        .responsibilities li {
            margin-bottom: 4px; /* space-y-1 */
        }
        
        .skills-container, .languages-container { 
            display: flex; 
            flex-wrap: wrap; 
            column-gap: 16px; /* gap-x-4 */
            row-gap: 8px; /* gap-y-2 */
        }
        
        .skill-item, .language-item {
            font-size: 0.875rem; /* text-sm */
            color: #1f2937; /* text-gray-800 */
        }
        
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        
        a { color: #3b82f6; text-decoration: none; } /* blue-500 */
        a:hover { text-decoration: underline; }

      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personalInfo.fullName || "Your Name"}</h1>
        <div class="contact-info">
            <span>${personalInfo.email || "email@example.com"}</span>
            ${personalInfo.phone ? `<span>|</span><span>${personalInfo.phone}</span>` : ''}
        </div>
        <div class="address">${personalInfo.address}</div>
      </div>

      ${personalInfo.summary ? `
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <p class="summary-text">${personalInfo.summary}</p>
      </div>` : ''}

      <div class="section">
        <div class="section-title">Work Experience</div>
        ${experience && experience.length > 0 ? experience.map((exp: any) => `
          <div class="item">
            <div class="item-header">
                <span>${exp.role || "Role"}</span>
                <span class="item-date">${exp.duration}</span>
            </div>
            <div class="item-subtitle">${exp.company}</div>
            ${exp.responsibilities ? `
            <div class="responsibilities">
                <ul>
                    ${exp.responsibilities.split('\n').filter((l: string) => l.trim()).map((line: string) => `
                        <li>${line.trim().startsWith('•') ? line.trim().substring(1).trim() : line.trim()}</li>
                    `).join('')}
                </ul>
            </div>` : ''}
          </div>
        `).join('') : '<p style="font-size:0.75rem; font-style:italic; color:#9ca3af;">No experience added yet</p>'}
      </div>

      <div class="section">
        <div class="section-title">Education</div>
        ${education && education.length > 0 ? education.map((edu: any) => `
          <div class="item">
            <div class="item-header">
                <span>${edu.degree || "Degree"}</span>
                <span class="item-date">${edu.startYear} - ${edu.endYear}</span>
            </div>
            <div class="item-subtitle">${edu.institution}</div>
          </div>
        `).join('') : '<p style="font-size:0.75rem; font-style:italic; color:#9ca3af;">No education added yet</p>'}
      </div>

      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-container">
            ${skills && skills.length > 0 ? skills.map((skill: any) => `
                <span class="skill-item">
                    ${typeof skill === 'string' ? skill : `${skill.name} (Lvl ${skill.level})`}
                </span>
            `).join('') : '<p style="font-size:0.75rem; font-style:italic; color:#9ca3af;">No skills added yet</p>'}
        </div>
      </div>

      ${languages && languages.length > 0 ? `
      <div class="section">
        <div class="section-title">Languages</div>
        <div class="languages-container">
            ${languages.map((l: any) => `
                <span class="language-item">
                    ${l.name} (Lvl ${l.level})
                </span>
            `).join('')}
        </div>
      </div>
      ` : ''}

      ${projects && projects.length > 0 ? `
      <div class="section">
        <div class="section-title">Projects</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            ${projects.map((proj: any) => `
                <div>
                    <h3 style="font-size: 0.875rem; font-weight: 700; color: #1f2937; margin: 0;">${proj.name}</h3>
                    <p style="font-size: 0.75rem; color: #374151; margin-top: 4px; margin-bottom: 0;">${proj.description}</p>
                    ${proj.link ? `<a href="${proj.link}" target="_blank" style="font-size: 0.75rem; margin-top: 4px; display: inline-block;">${proj.link}</a>` : ''}
                </div>
            `).join('')}
        </div>
      </div>
      ` : ''}

      ${references && references.length > 0 ? `
      <div class="section">
        <div class="section-title">References</div>
        <div class="grid-2">
            ${references.map((ref: any) => `
                <div style="font-size: 0.875rem;">
                    <div style="font-weight: 700; color: #1f2937;">${ref.name}</div>
                    <div style="font-style: italic; color: #4b5563;">${ref.company}</div>
                    <div style="font-size: 0.75rem; color: #6b7280; margin-top: 4px;">
                        ${ref.email} | ${ref.phone}
                    </div>
                </div>
            `).join('')}
        </div>
      </div>
      ` : ''}
    </body>
    </html>
  `;
};
