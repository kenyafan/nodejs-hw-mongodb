import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Перевіряємо наявність заголовку авторизації
    const { authorization } = req.headers;

    if (!authorization) {
      throw createHttpError(401, 'Authorization header is missing');
    }

    // Перевіряємо, чи починається токен з 'Bearer '
    if (!authorization.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization token is missing or invalid');
    }

    // Отримуємо сам токен
    const token = authorization.split(' ')[1];

    // Перевіряємо токен
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Шукаємо користувача по decoded.id
      const user = await User.findById(decoded.id);
      if (!user) {
        throw createHttpError(401, 'User not found');
      }

      // Додаємо користувача в запит
      req.user = user;

      // Продовжуємо обробку запиту
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }

      // Логування помилок токену
      console.error('JWT verification failed:', error.message);
      throw createHttpError(401, 'Invalid access token');
    }
  } catch (error) {
    next(error);
  }
};
