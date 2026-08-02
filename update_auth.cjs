const fs = require('fs');
const path = require('path');

const files = [
  'src/admin/AdminDashboard.jsx',
  'src/admin/pages/ManageEvents.jsx',
  'src/admin/pages/ManageGallery.jsx',
  'src/admin/pages/ManageTeam.jsx',
  'src/admin/pages/ManageMessages.jsx',
  'src/admin/pages/ManageMembers.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/{ withCredentials: true }/g, "{ headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }");
  
  // ManageGallery has an extra one for multipart form data
  content = content.replace(
    /withCredentials: true,\n\s*headers: { 'Content-Type': 'multipart\/form-data' }/g,
    "headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('adminToken')}` }"
  );
  
  fs.writeFileSync(filePath, content);
});

// Update handleLogout in AdminDashboard.jsx
const dashboardPath = path.join(__dirname, 'src/admin/AdminDashboard.jsx');
let dbContent = fs.readFileSync(dashboardPath, 'utf8');
dbContent = dbContent.replace(
  /await axios\.post\(\`\$\{API_URL\}\/api\/auth\/logout\`, \{\}, \{ headers: \{ Authorization: \`Bearer \$\{localStorage\.getItem\('adminToken'\)\}\` \} \}\);/g,
  "await axios.post(`${API_URL}/api/auth/logout`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });\n      localStorage.removeItem('adminToken');"
);
fs.writeFileSync(dashboardPath, dbContent);

console.log('Admin auth headers updated');
