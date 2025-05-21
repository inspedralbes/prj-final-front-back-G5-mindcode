import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Restriction = sequelize.define('Restriction', {
  idrestriction: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: DataTypes.TEXT,
}, {
  tableName: 'RESTRICTION',
  timestamps: false,
});

export default Restriction;
