import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EurekaParticipant = sequelize.define('EurekaParticipant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  team_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
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
  is_leader: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export default EurekaParticipant;
