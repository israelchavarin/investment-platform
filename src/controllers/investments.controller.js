import currency from 'currency.js';
import Investment from '../database/models/investment.js';
import Opportunity from '../database/models/opportunity.js';
import UserBalance from '../database/models/userBalance.js';
import { sequelize } from '../config/database.config.js';

/** Invest function
 * Input: opportunityReference, investmentAmount
 * Data output: newInvestment
 */
export const invest = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Data gathering
    const {
      opportunityReference, investmentAmount,
    } = req.body;
    const investmentCurrency = currency(investmentAmount);

    // Find the opportunity
    const opportunity = await Opportunity.findOne({
      where: { opportunity_reference: opportunityReference },
      transaction: t,
    });

    // Opportunity validations
    if (!opportunity) {
      await t.rollback();
      return res.status(404).json({
        status: 404,
        error: 'Opportunity could not be found',
      });
    }

    if (opportunity.status === 'completed') {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: 'Opportunity not available for investment',
      });
    }

    // Balance validations
    const userBalance = await UserBalance.findByPk(req.user.id);

    if (!userBalance) {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: 'User could not be identified',
      });
    }

    if (investmentAmount > userBalance.balance) {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: `You only have $${userBalance.balance} of the $${investmentAmount}`,
      });
    }

    if (investmentAmount > opportunity.limit_to_invest_per_transaction) {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: `You can only invest $${opportunity.limit_to_invest_per_transaction} per transaction for this opportunity`,
      });
    }

    if (investmentAmount > (opportunity.investment_goal - opportunity.total_collected)) {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: `Maximum possible investment: $${opportunity.investment_goal - opportunity.total_collected}`,
      });
    }

    // Create new investment
    const newInvestment = await Investment.create({
      user_id: req.user.id,
      opportunity_reference: opportunityReference,
      investment_amount: investmentAmount,
    }, { transaction: t });

    // Update total_collected for the opportunity
    opportunity.total_collected += investmentAmount;

    // Check if investment_goal is reached
    if (opportunity.total_collected >= opportunity.investment_goal) {
      opportunity.status = 'completed';
    }

    // Save changes to the opportunity
    await opportunity.save({ transaction: t });

    // Update balances of user
    userBalance.balance = currency(
      userBalance.balance,
    ).subtract(
      investmentCurrency,
    ).value;

    userBalance.used_balance = currency(
      userBalance.used_balance,
    ).add(
      investmentCurrency,
    ).value;

    // Save changes to the userBalance
    await userBalance.save({ transaction: t });

    // Commit the transaction
    await t.commit();

    return res.status(201).json({
      status: 201,
      message: 'Investment successful',
      data: { newInvestment },
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** List investments function
 * Input: none
 * Data output: [investments]
 */
export const listInvestments = async (req, res) => {
  try {
    const { id } = req.user;
    const investments = await Investment.findAll(
      { where: { user_id: id } },
    );

    return res.status(200).json({
      status: 200,
      data: { investments },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** Withdraw investment function
 * Input: none
 * Data output: investment
 */
export const withdraw = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const investment = await Investment.findByPk(id, { transaction: t });
    const opportunity = await Opportunity.findOne({
      where: { opportunity_reference: investment.opportunity_reference },
      transaction: t,
    });

    if (!investment || investment.is_hidden || !opportunity || opportunity.is_hidden || opportunity.status === 'completed') {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: 'Investment not available for withdrawal',
      });
    }

    investment.is_hidden = true;

    await investment.save({ transaction: t });

    // Update balances of user
    const investmentCurrency = currency(investment.investment_amount);
    const userBalance = await UserBalance.findByPk(req.user.id);

    userBalance.balance = currency(
      userBalance.balance,
    ).add(
      investmentCurrency,
    ).value;

    userBalance.used_balance = currency(
      userBalance.used_balance,
    ).subtract(
      investmentCurrency,
    ).value;

    await userBalance.save({ transaction: t });

    await t.commit();

    return res.status(200).json({
      status: 200,
      message: 'Withdrawal successful, balance updated',
      data: { userBalance },
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};
