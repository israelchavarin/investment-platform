import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.config.js';
import UserAccess from '../database/models/userAccess.js';
import User from '../database/models/user.js';
import UserBalance from '../database/models/userBalance.js';
import generateToken from '../helpers/jwt.js';

/** Register function
 * Input: givenName, familyName, email, password, balance
 * Data output: accessToken, refreshToken
 */
export const register = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Data gathering
    const {
      givenName, familyName, email, password, balance,
    } = req.body;

    // Email verification
    const existingAccess = await UserAccess.findOne({ where: { email }, transaction: t });

    if (existingAccess && !existingAccess.is_hidden) {
      await t.rollback();
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
    const accessToken = await generateToken(
      { id: userId },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRATION,
    );
    const refreshToken = await generateToken(
      { id: userId },
      process.env.REFRESH_JWT_SECRET,
      process.env.REFRESH_JWT_EXPIRATION,
    );

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });

    return res.status(201).json({
      status: 201,
      message: 'User created successfully',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** Login function
 * Input: email, password
 * Data output: token, refreshToken
 */
export const login = async (req, res) => {
  // Data gathering
  const { email, password } = req.body;

  try {
    // User search by email
    const userAccess = await UserAccess.findOne({
      where: { email, is_hidden: false },
      attributes: ['user_id', 'email', 'password'],
    });

    if (!userAccess) return res.status(400).json({ status: 400, error: 'User not found' });

    // Password validation
    const isMatch = await bcrypt.compare(password, userAccess.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, error: 'Invalid credentials' });
    }

    // Creation and return of tokens
    const accessToken = await generateToken(
      { id: userAccess.user_id },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRATION,
    );
    const refreshToken = await generateToken(
      { id: userAccess.user_id },
      process.env.REFRESH_JWT_SECRET,
      process.env.REFRESH_JWT_EXPIRATION,
    );

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });

    return res.status(200).json({
      status: 200,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};
