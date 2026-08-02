import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Setting = sequelize.define('Setting', {
  logo_url: { type: DataTypes.STRING },
  website_name: { type: DataTypes.STRING, defaultValue: 'MRCET E-Cell' },
  social_linkedin: { type: DataTypes.STRING },
  social_instagram: { type: DataTypes.STRING },
  social_twitter: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  footer_text: { type: DataTypes.STRING, defaultValue: '© 2026 MRCET E-Cell. All rights reserved.' }
});

export default Setting;
