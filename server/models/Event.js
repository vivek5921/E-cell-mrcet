import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('Event', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING },
  time: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  poster_url: { type: DataTypes.STRING },
  registration_link: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'), defaultValue: 'upcoming' }
});

export default Event;
