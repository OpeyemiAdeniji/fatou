import express from 'express';
import {
	createFounder,
	deleteFounder,
	getAllFounders,
	getSingleFounder,
	updateFounder,
	getAllApprovedFounders
} from '../../../app/controllers/founderController';
import { protect, admin } from '../../../app/middlewares/auth';

const router = express.Router();

router.use(protect);

router.route('/').post(createFounder).get(admin, getAllFounders);
router.get('/approved', getAllApprovedFounders);
router.route('/:founderId').get(getSingleFounder).put(updateFounder).delete(deleteFounder);

export default router;
