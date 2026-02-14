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
};

export const advancedTemplate = (data: any) => {
    const { personalInfo, education, experience, skills, languages } = data;
    
    // Helper for rating dots/bars
    const renderRating = (level: number) => {
        const max = 5;
        let dots = '';
        for (let i = 1; i <= max; i++) {
            dots += `< span style = "display:inline-block; width:12px; height:12px; background-color:${i <= level ? '#333' : '#ccc'}; margin-right:2px;" > </span>`;
}
return dots;
    };

return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        body { font-family: 'Roboto', Helvetica, Arial, sans-serif; line-height: 1.5; color: #333; padding: 40px; }
        
        .header { margin-bottom: 40px; }
        .header h1 { font-size: 2.8rem; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #000; }
        .header-role { font-size: 1.2rem; margin-top: 5px; color: #555; font-weight: bold; }
        .contact-info { margin-top: 15px; display: flex; flex-wrap: wrap; gap: 20px; font-size: 0.9rem; color: #444; }
        
        .section { margin-bottom: 30px; }
        .section-title { 
            font-size: 1.1rem; 
            font-weight: 700; 
            text-transform: uppercase; 
            border-bottom: 2px solid #000; 
            padding-bottom: 8px; 
            margin-bottom: 20px; 
        }
        
        .item { display: flex; margin-bottom: 20px; }
        .item-left { width: 25%; font-weight: bold; font-size: 0.95rem; color: #000; padding-right: 15px; }
        .item-right { width: 75%; }
        
        .item-title { font-weight: bold; font-size: 1.1rem; color: #000; }
        .item-subtitle { font-style: italic; color: #555; margin-bottom: 5px; }
        
        .skills-grid { display: flex; flex-wrap: wrap; gap: 20px; }
        .skill-item { width: 45%; display: flex; justify-content: space-between; align-items: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personalInfo.fullName}</h1>
        <div class="contact-info">
            <span>📞 ${personalInfo.phone}</span>
            <span>✉️ ${personalInfo.email}</span>
            <span>📍 ${personalInfo.address}</span>
        </div>
        ${personalInfo.summary ? `<p style="margin-top:20px; color:#666;">${personalInfo.summary}</p>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((exp: any) => `
          <div class="item">
            <div class="item-left">${exp.duration}</div>
            <div class="item-right">
                <div class="item-title">${exp.role}</div>
                <div class="item-subtitle">${exp.company}</div>
                <div>${(exp.responsibilities || "").split('\n').join('<br>')}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Education</div>
        ${education.map((edu: any) => `
          <div class="item">
            <div class="item-left">${edu.startYear} - ${edu.endYear}</div>
            <div class="item-right">
                <div class="item-title">${edu.degree}</div>
                <div class="item-subtitle">${edu.institution}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-grid">
            ${skills.map((s: any) => `
                <div class="skill-item">
                    <span>${s.name || s}</span>
                    <span>${renderRating(s.level || 5)}</span>
                </div>
            `).join('')}
        </div>
      </div>

      ${languages && languages.length > 0 ? `
      <div class="section">
        <div class="section-title">Languages</div>
        <div class="skills-grid">
            ${languages.map((l: any) => `
                <div class="skill-item">
                    <span>${l.name}</span>
                    <span>${renderRating(l.level || 5)}</span>
                </div>
            `).join('')}
        </div>
      </div>
      ` : ''}
    </body>
    </html>
    `;
};
