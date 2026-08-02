import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('super_admin', 'admin'), defaultValue: 'admin' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export default Admin;
