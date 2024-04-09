import User from '../database/models/user.js';
import UserAccess from '../database/models/userAccess.js';
import UserBalance from '../database/models/userBalance.js';

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
 * Input: xxxxxx
 * Data output: [updatedUser]
 */
export const updateUserData = async (req, res) => {
  try {
    const { givenName } = req.body;
    return res.status(200).json({
      status: 200,
      data: { givenName },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};
