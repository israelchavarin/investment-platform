import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.config.js';
import User from './user.js';

const UserBalance = sequelize.define(
  'user_balance',
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    used_balance: {
      type: DataTypes.DECIMAL(9, 2),
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

User.hasOne(UserBalance, { foreignKey: 'user_id' });
UserBalance.belongsTo(User, { foreignKey: 'user_id' });

export default UserBalance;
