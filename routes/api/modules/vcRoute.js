import express from 'express';
import {
	createVC,
	deleteSingleVC,
	getAllVCs,
	getSingleVC,
	updateVC,
} from '../../../app/controllers/vcController';
import { protect, admin } from '../../../app/middlewares/auth';

const router = express.Router();

router.use(protect);

router.route('/').post(createVC).get(admin, getAllVCs);
router.route('/:vcId').get(getSingleVC).put(updateVC).delete(deleteSingleVC);

export default router;
