import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.config.js';
import User from './user.js';

const UserAccess = sequelize.define(
  'user_access',
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

User.hasOne(UserAccess, { foreignKey: 'user_id' });
UserAccess.belongsTo(User, { foreignKey: 'user_id' });

export default UserAccess;
