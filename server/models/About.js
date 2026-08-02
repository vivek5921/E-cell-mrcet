import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const About = sequelize.define('About', {
  heading: { type: DataTypes.STRING, defaultValue: 'What is E-Cell?' },
  description: { type: DataTypes.TEXT, defaultValue: 'E-Cell helps students learn entrepreneurship...' },
  mission: { type: DataTypes.TEXT, defaultValue: '' },
  vision: { type: DataTypes.TEXT, defaultValue: '' }
});

export default About;
