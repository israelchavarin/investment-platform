import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.config.js';

const User = sequelize.define(
  'user',
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    given_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    family_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default User;
