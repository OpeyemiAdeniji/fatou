import express from 'express';
import {
	forgotPassword,
	getAuthUser,
	resetPassword,
	signin,
	signup,
	socialSignin,
	updatePassword,
} from '../../../app/controllers/authController';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/social-signin', socialSignin);
router.get('/me', protect, getAuthUser);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resettoken', resetPassword);

export default router;
