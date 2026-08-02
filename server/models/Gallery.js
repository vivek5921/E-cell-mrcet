import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Gallery = sequelize.define('Gallery', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'Events' }
});

export default Gallery;
