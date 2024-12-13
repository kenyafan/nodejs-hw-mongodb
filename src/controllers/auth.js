import { register } from '../services/auth.js';
import { login } from '../services/auth.js';
import { refreshSession as refreshSessionService } from '../services/auth.js';
import { logout } from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await register({ name, email, password });

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await login({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshSessionService(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    await logout(refreshToken);

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged out!',
    });
  } catch (error) {
    next(error);
  }
};
