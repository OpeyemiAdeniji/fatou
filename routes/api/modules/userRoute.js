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

router.post('/profile/update', editProfile);

// settings
router.put('/settings/update', changePreferences);
router.put('/work/mentorship', changeMentorShipProfile);
router.post('/work/experience', editAddWorkExperience);
router.put('/work/experience/:experienceId', editAddWorkExperience);
router.post('/work/options', editWorkOption);
router.get('/:userId/events', protect, getSingleUserEvents);
router.put('/:userId/events/:eventId', protect, editEvent);
router.put('/:userId/news/:newsId', protect, editNews);

export default router;
