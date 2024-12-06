import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.empty': '"name" cannot be empty',
    'string.min': '"name" should have at least 3 characters',
    'string.max': '"name" should not exceed 20 characters',
    'any.required': '"name" is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.empty': '"phoneNumber" cannot be empty',
    'string.min': '"phoneNumber" should have at least 3 characters',
    'string.max': '"phoneNumber" should not exceed 20 characters',
    'any.required': '"phoneNumber" is required',
  }),
  email: Joi.string().email().messages({
    'string.empty': '"email" cannot be empty',
    'string.email': '"email" must be a valid email',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': '"isFavourite" must be a boolean value',
  }),
  contactType: Joi.string().min(3).max(20).required().messages({
    'string.empty': '"contactType" cannot be empty',
    'string.min': '"contactType" should have at least 3 characters',
    'string.max': '"contactType" should not exceed 20 characters',
    'any.required': '"contactType" is required',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(20),
}).min(1);
