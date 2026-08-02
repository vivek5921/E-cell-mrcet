import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TeamMember = sequelize.define('TeamMember', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'Technical' },
  department: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  linkedin: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  image_url: { type: DataTypes.STRING }
});

export default TeamMember;
