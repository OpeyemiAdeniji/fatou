import express from 'express';
import {
	createFeedPost,
	deleteFeedPost,
	getAllFeedPost,
	getSingleFeedPost,
} from '../../../app/controllers/feedController';
import { protect, admin } from '../../../app/middlewares/auth';

const router = express.Router();

router.use(protect);

router.route('/').post(createFeedPost).get(getAllFeedPost);
router.route('/:feedId').get(getSingleFeedPost).delete(admin, deleteFeedPost);

export default router;
