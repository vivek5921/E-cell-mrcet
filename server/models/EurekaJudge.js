import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EurekaJudge = sequelize.define('EurekaJudge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default EurekaJudge;
