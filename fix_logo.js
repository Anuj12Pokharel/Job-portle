const fs = require('fs');
const path = require('path');

const files = [
  'vite-project/src/Pages/Jobs.tsx',
  'vite-project/src/Pages/JobDetails.tsx',
  'vite-project/src/Pages/BlogDetails.tsx',
  'vite-project/src/components/Jobcard.tsx',
  'vite-project/src/components/Job/JobList.tsx',
  'vite-project/src/components/Job/Alljob.tsx',
  'vite-project/src/components/Home/Topjob.tsx',
  'vite-project/src/Pages/SuperAdminDashboard.tsx',
  'vite-project/src/Pages/ProfileSettings.tsx',
  'vite-project/src/Pages/EmployerProfileSettings.tsx',
  'vite-project/src/components/Navbar.tsx',
  'vite-project/src/components/Blog/Blogsection.tsx'
];

files.forEach(f => {
  const filePath = path.join(process.cwd(), f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace !logo
    content = content.replace(/if \(!logo\) return "";/g, 'if (!logo || String(logo) === "undefined" || String(logo) === "null") return "";');
    
    // Replace !imagePath
    content = content.replace(/if \(!imagePath\) return "";/g, 'if (!imagePath || String(imagePath) === "undefined" || String(imagePath) === "null") return "";');
    
    content = content.replace(/if \(!imagePath \|\| imagePath === "null"\) return "";/g, 'if (!imagePath || String(imagePath) === "undefined" || String(imagePath) === "null") return "";');
    
    // Replace !image
    content = content.replace(/if \(!image\) return "";/g, 'if (!image || String(image) === "undefined" || String(image) === "null") return "";');

    fs.writeFileSync(filePath, content);
    console.log('Updated ' + f);
  } else {
    console.log('File not found: ' + f);
  }
});
