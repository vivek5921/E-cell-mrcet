import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Registration = sequelize.define('Registration', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  roll_number: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  year: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  interests: { type: DataTypes.TEXT },
  submission_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

export default Registration;
