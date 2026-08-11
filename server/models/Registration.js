import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Registration = sequelize.define('Registration', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  roll_number: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  year: { type: DataTypes.STRING },
  section: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  skills: { type: DataTypes.TEXT },
  interests: { type: DataTypes.TEXT },
  status: { 
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'), 
    defaultValue: 'pending' 
  },
  resume_url: { type: DataTypes.STRING },
  submission_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

export default Registration;

