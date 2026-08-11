import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EurekaScore = sequelize.define('EurekaScore', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  team_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  judge_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default EurekaScore;
