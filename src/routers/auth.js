import express from 'express';
import { registerUser } from '../controllers/auth.js';
import { loginUser } from '../controllers/auth.js';
import { refreshSession } from '../controllers/auth.js';
import { logoutUser } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUser),
);
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSession));
router.post('/logout', ctrlWrapper(logoutUser));

export default router;
