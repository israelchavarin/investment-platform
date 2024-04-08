import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.config.js';
import User from './user.js';
import Opportunity from './opportunity.js';

const Investment = sequelize.define(
  'investment',
  {
    investment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    opportunity_reference: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    investment_amount: {
      type: DataTypes.INTEGER,
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

Investment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Investment, { foreignKey: 'user_id' });

Investment.belongsTo(Opportunity, { foreignKey: 'opportunity_reference' });
Opportunity.hasMany(Investment, { foreignKey: 'opportunity_reference' });

export default Investment;
