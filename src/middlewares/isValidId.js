import mongoose from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return next(createError(400, 'Invalid ID format'));
  }
  next();
};
