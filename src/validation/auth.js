import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': '"name" cannot be empty',
    'string.min': '"name" should have at least 3 characters',
    'string.max': '"name" should not exceed 50 characters',
    'any.required': '"name" is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': '"email" cannot be empty',
    'string.email': '"email" must be a valid email address',
    'any.required': '"email" is required',
  }),
  password: Joi.string().min(8).max(50).required().messages({
    'string.empty': '"password" cannot be empty',
    'string.min': '"password" should have at least 8 characters',
    'string.max': '"password" should not exceed 50 characters',
    'any.required': '"password" is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': '"email" cannot be empty',
    'string.email': '"email" must be a valid email address',
    'any.required': '"email" is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': '"password" cannot be empty',
    'any.required': '"password" is required',
  }),
});

export const resetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': '"email" cannot be empty',
    'string.email': '"email" must be a valid email address',
    'any.required': '"email" is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': '"token" cannot be empty',
    'any.required': '"token" is required',
  }),
  password: Joi.string().min(8).max(50).required().messages({
    'string.empty': '"password" cannot be empty',
    'string.min': '"password" should have at least 8 characters',
    'string.max': '"password" should not exceed 50 characters',
    'any.required': '"password" is required',
  }),
});
