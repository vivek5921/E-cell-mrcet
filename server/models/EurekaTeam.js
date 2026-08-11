import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EurekaTeam = sequelize.define('EurekaTeam', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  team_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startup_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startup_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  eureka_rid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  eureka_team_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  leader_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  leader_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  leader_phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  college: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  team_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'College Registration'
  },
  consent: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

export default EurekaTeam;
