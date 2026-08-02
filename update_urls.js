const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Team.jsx',
  'src/components/JoinModal.jsx',
  'src/components/Gallery.jsx',
  'src/components/Contact.jsx',
  'src/components/Activities.jsx',
  'src/components/About.jsx',
  'src/admin/pages/ManageTeam.jsx',
  'src/admin/pages/ManageMessages.jsx',
  'src/admin/pages/ManageMembers.jsx',
  'src/admin/pages/ManageEvents.jsx',
  'src/admin/HiddenAdminGate.jsx',
  'src/admin/AdminDashboard.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const isComponent = file.includes('components');
  const isAdminPage = file.includes('admin\\\\pages') || file.includes('admin/pages');
  const isAdminRoot = file.includes('admin\\\\') || file.includes('admin/') && !isAdminPage;
  
  let importPath = '';
  if (isComponent || isAdminRoot) importPath = '../config.js';
  else if (isAdminPage) importPath = '../../config.js';
  
  if (!content.includes('import { API_URL }')) {
    content = content.replace(/import React(.*);\n/, `import React$1;\nimport { API_URL } from '${importPath}';\n`);
  }
  
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_URL}$1`');
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${API_URL}$1`');
  
  fs.writeFileSync(filePath, content);
});

const galleryPath = path.join(__dirname, 'src/admin/pages/ManageGallery.jsx');
let galleryContent = fs.readFileSync(galleryPath, 'utf8');
galleryContent = galleryContent.replace(/const API_URL = `http:\/\/\$\{window\.location\.hostname\}:5000`;\n/, '');
if (!galleryContent.includes('import { API_URL }')) {
  galleryContent = galleryContent.replace(/import React(.*);\n/, `import React$1;\nimport { API_URL } from '../../config.js';\n`);
}
fs.writeFileSync(galleryPath, galleryContent);

console.log('All files updated successfully');
