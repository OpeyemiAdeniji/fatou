import express from 'express';
import {
	createFeedPost,
	deleteFeedPost,
	getAllFeedPosts,
	getSingleFeedPost,
} from '../../../app/controllers/feedController';
import { protect, admin } from '../../../app/middlewares/auth';

const router = express.Router();

router.use(protect);

router.route('/').post(createFeedPost).get(getAllFeedPosts);
router.route('/:feedId').get(getSingleFeedPost).delete(admin, deleteFeedPost);

export default router;
