import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Class from './class.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  gmail: DataTypes.STRING,
  teacher: DataTypes.BOOLEAN,
  language: DataTypes.TEXT,
  googleId: DataTypes.TEXT,
  class: {
    type: DataTypes.INTEGER,
    references: {
      model: Class,
      key: 'idclass',
    },
  },
  message_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'USER',
  timestamps: false,
});

User.belongsTo(Class, { foreignKey: 'class' });

export default User;
