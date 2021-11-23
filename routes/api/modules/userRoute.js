import express from 'express';
import {
	editEvent,
	getSingleUserEvents,
} from '../../../app/controllers/eventController';
import { editNews } from '../../../app/controllers/newsController';
import {
	changeMentorShipProfile,
	changePreferences,
	editAddWorkExperience,
	editProfile,
	editWorkOption,
} from '../../../app/controllers/userController';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.use(protect);

router.post('/profile/update', editProfile);

// settings
router.put('/settings/update', changePreferences);
router.put('/work/mentorship', changeMentorShipProfile);
router.post('/work/experience', editAddWorkExperience);
router.put('/work/experience/:experienceId', editAddWorkExperience);
router.post('/work/options', editWorkOption);
router.get('/:userId/events', getSingleUserEvents);
router.put('/:userId/events/:eventId', editEvent);
router.put('/:userId/news/:newsId', editNews);

export default router;
