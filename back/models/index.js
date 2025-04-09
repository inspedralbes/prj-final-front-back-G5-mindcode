import sequelize from '../config/db.js';
import Class from './class.js';
import User from './user.js';
import Language from './language.js';
import Restriction from './restriction.js';

// Setup relationships
User.belongsTo(Class, { foreignKey: 'class' });

export {
  sequelize,
  Class,
  User,
  Language,
  Restriction,
};
