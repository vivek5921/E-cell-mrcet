const fs = require('fs');
const path = require('path');

const fixImageUrls = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace src={item.image_url} with src={item.image_url?.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`}
  content = content.replace(/src=\{([a-zA-Z0-9_.]+image_url)\}/g, "src={$1?.startsWith('http') ? $1 : `${API_URL}${$1}`}");
  
  // Replace activeImage.image_url in lightbox
  content = content.replace(/src=\{([a-zA-Z0-9_.]+image_url)\}/g, "src={$1?.startsWith('http') ? $1 : `${API_URL}${$1}`}");
  
  // Replace src={img.image_url} in ManageGallery
  content = content.replace(/src=\{([a-zA-Z0-9_.]+image_url)\}/g, "src={$1?.startsWith('http') ? $1 : `${API_URL}${$1}`}");

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  }
};

const components = [
  'src/components/Gallery.jsx',
  'src/components/Team.jsx',
  'src/admin/pages/ManageGallery.jsx',
  'src/admin/pages/ManageTeam.jsx'
];

components.forEach(file => fixImageUrls(path.join(__dirname, file)));
