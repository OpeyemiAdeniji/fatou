import express from 'express';
import {
	createVC,
	deleteSingleVC,
	getAllApprovedVCs,
	getAllVCs,
	getSingleVC,
	updateVC,
} from '../../../app/controllers/vcController';
import { protect, admin } from '../../../app/middlewares/auth';

const router = express.Router();

// router.use(protect);

router.route('/').post(createVC).get(admin, getAllVCs);
router.get('/approved', getAllApprovedVCs);
router.route('/:vcId').get(getSingleVC).put(updateVC).delete(deleteSingleVC);

export default router;
