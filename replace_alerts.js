import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (content.includes('alert(')) {
    // Add import if not present
    if (!content.includes('import toast from \'react-hot-toast\'')) {
      content = 'import toast from \'react-hot-toast\';\n' + content;
    }
    
    // Replace alert( with toast.error or toast.success
    content = content.replace(/alert\((.*?'Failed.*?')\)/gi, 'toast.error($1)');
    content = content.replace(/alert\((.*?err.*?)\)/gi, 'toast.error($1)');
    content = content.replace(/alert\((.*?'No team.*?')\)/gi, 'toast.error($1)');
    
    // Replace remaining alerts with success
    content = content.replace(/alert\((.*?)\)/g, 'toast.success($1)');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
}

walkDir('./src', processFile);
console.log('Done');
