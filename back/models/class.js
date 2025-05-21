import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Class = sequelize.define('Class', {
  idclass: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: DataTypes.STRING,
  name: DataTypes.STRING,
  teacher_id: DataTypes.TEXT,
  language: DataTypes.TEXT,
}, {
  tableName: 'CLASS',
  timestamps: false,
});

export default Class;
