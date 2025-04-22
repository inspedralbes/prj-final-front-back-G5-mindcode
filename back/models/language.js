import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Language = sequelize.define('Language', {
  idlanguage: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
}, {
  tableName: 'LANGUAGE',
  timestamps: false,
});

export default Language;
