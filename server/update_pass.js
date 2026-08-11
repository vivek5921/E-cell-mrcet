import bcrypt from 'bcrypt';
import { Admin } from './models/index.js';

async function updatePassword() {
  try {
    const admin = await Admin.findOne();
    if (admin) {
      admin.password_hash = await bcrypt.hash('admin123', 10);
      await admin.save();
      console.log('Password updated to admin123');
    } else {
      await Admin.create({
        email: 'master@admin.com',
        password_hash: await bcrypt.hash('admin123', 10),
        role: 'super_admin'
      });
      console.log('Admin created with password admin123');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
}

updatePassword();
