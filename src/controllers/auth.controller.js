import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.config.js';
import UserAccess from '../database/models/userAccess.js';
import User from '../database/models/user.js';
import UserBalance from '../database/models/userBalance.js';
import generateToken from '../helpers/jwt.js';

/** Register function
 * Input: givenName, familyName, email, password, balance
 * Output:
 *  when sucessful: { status, message, data: { token, refreshToken } }
 *  when error: { status, error }
 */
export const register = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Data gathering
    const {
      givenName, familyName, email, password, balance,
    } = req.body;

    // Email verification
    const existingAccess = await UserAccess.findOne({ where: { email } });

    if (existingAccess) {
      return res.status(400).json({
        status: 400,
        error: 'Email provided already in use',
      });
    }

    // Creation of user
    const newUser = await User.create({
      given_name: givenName,
      family_name: familyName,
    }, { transaction: t });

    const { user_id: userId } = newUser;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creation of their access
    await UserAccess.create({
      user_id: userId,
      email,
      password: hashedPassword,
    }, { transaction: t });

    // Creation of their balance
    await UserBalance.create({
      user_id: userId,
      balance,
    }, { transaction: t });

    await t.commit();

    // Creation and return of tokens
    const token = await generateToken(
      { id: userId },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRATION,
    );
    const refreshToken = await generateToken(
      { id: userId },
      process.env.REFRESH_JWT_SECRET,
      process.env.REFRESH_JWT_EXPIRATION,
    );

    return res.status(201).json({
      status: 201,
      message: 'User created successfully',
      data: { token, refreshToken },
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ status: 500, error: error.message });
  }
};

/** Login function
 * Input: email, password
 * Output: We'll see about that
 */
export const login = (_, res) => {
  res.status(200).json({ status: 'logged in', message: 'testing' });
};
