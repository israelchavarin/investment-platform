import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.config.js';

const Opportunity = sequelize.define(
  'opportunity',
  {
    opportunity_reference: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    investment_goal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_collected: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed'),
      defaultValue: 'active',
      allowNull: false,
    },
    limit_to_invest_per_transaction: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default Opportunity;
