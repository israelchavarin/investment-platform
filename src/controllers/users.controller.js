import bcrypt from 'bcryptjs';
import currency from 'currency.js';
import User from '../database/models/user.js';
import UserAccess from '../database/models/userAccess.js';
import UserBalance from '../database/models/userBalance.js';
import { sequelize } from '../config/database.config.js';

/** List users function
 * Input: none
 * Data output: [users]
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_hidden: false },
      include: [
        {
          model: UserAccess,
          attributes: ['email'],
        },
        {
          model: UserBalance,
          attributes: ['balance', 'used_balance'],
        },
      ],
    });

    return res.status(200).json({
      status: 200,
      data: { users },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** Update user data function
 * Input: givenName, familyName, email, password
 * Data output: none
 */
export const updateUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.user;
    const {
      givenName, familyName, email, password,
    } = req.body;

    const loggedUser = await User.findOne({
      where: { user_id: id, is_hidden: false },
      transaction: t,
    });
    const loggedUserAccess = await UserAccess.findOne({
      where: { user_id: id, is_hidden: false },
      transaction: t,
    });

    if (!loggedUser || !loggedUserAccess) {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: 'User could not be identified',
      });
    }

    // New email validation
    const existingAccess = await UserAccess.findOne({
      where: { email, is_hidden: false },
      transaction: t,
    });

    if (existingAccess) {
      await t.rollback();
      return res.status(400).json({
        status: 400,
        error: 'Email provided already in use',
      });
    }

    // Update of user
    loggedUser.given_name = givenName;
    loggedUser.family_name = familyName;

    await loggedUser.save({ transaction: t });

    // Update of their accesses
    const hashedPassword = await bcrypt.hash(password, 10);

    loggedUserAccess.email = email;
    loggedUserAccess.password = hashedPassword;

    await loggedUserAccess.save({ transaction: t });

    await t.commit();

    return res.status(200).json({
      status: 200,
      message: 'Information updated successfully',
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** Balance deposit function
 * Input: balance
 * Data output: userBalance
 */
export const deposit = async (req, res) => {
  try {
    const { id } = req.user;
    const { balance } = req.body;
    const depositCurrency = currency(balance);
    const loggedUserBalance = await UserBalance.findOne({
      where: { user_id: id, is_hidden: false },
    });

    if (!loggedUserBalance) {
      return res.status(400).json({
        status: 400,
        error: 'User could not be identified',
      });
    }

    loggedUserBalance.balance = currency(
      loggedUserBalance.balance,
    ).add(
      depositCurrency,
    ).value;

    await loggedUserBalance.save();

    return res.status(200).json({
      status: 200,
      message: 'Deposit successful, balance updated',
      data: { loggedUserBalance },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** Balance withdrawal function
 * Input: balance
 * Data output: userBalance
 */
export const withdraw = async (req, res) => {
  try {
    const { id } = req.user;
    const { balance } = req.body;
    const withdrawalCurrency = currency(balance);
    const loggedUserBalance = await UserBalance.findOne({
      where: { user_id: id, is_hidden: false },
    });

    if (!loggedUserBalance) {
      return res.status(400).json({
        status: 400,
        error: 'User could not be identified',
      });
    }

    const loggedUserBalanceAvailableCurrency = currency(
      loggedUserBalance.balance,
    );

    if (withdrawalCurrency.value > loggedUserBalanceAvailableCurrency.value) {
      return res.status(400).json({
        status: 400,
        error: `You only have $${loggedUserBalanceAvailableCurrency.value}`,
      });
    }

    loggedUserBalance.balance = currency(
      loggedUserBalance.balance,
    ).subtract(
      withdrawalCurrency,
    ).value;

    await loggedUserBalance.save();

    return res.status(200).json({
      status: 200,
      message: 'Withdrawal successful, balance updated',
      data: { loggedUserBalance },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};
