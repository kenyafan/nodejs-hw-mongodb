import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return user;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' },
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' },
  );

  const sessionData = {
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  const session = await Session.startSession();
  session.startTransaction();
  try {
    await Session.deleteMany({ userId: user._id });
    await Session.create([sessionData], { session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw createHttpError(500, 'Failed to create a session');
  } finally {
    session.endSession();
  }

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  try {
    console.log('Received refresh token:', refreshToken);
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    const session = await Session.findOne({ refreshToken, userId });
    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    if (new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Refresh token has expired');
    }

    await Session.deleteOne({ _id: session._id });

    const accessToken = jwt.sign(
      { id: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' },
    );
    const newRefreshToken = jwt.sign(
      { id: userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' },
    );

    const newSessionData = {
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    await Session.create(newSessionData);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Error during refresh session:', error);
    if (error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Refresh token has expired');
    }
    throw createHttpError(401, 'Invalid refresh token');
  }
};

export const logout = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  await Session.deleteOne({ _id: session._id });
};
