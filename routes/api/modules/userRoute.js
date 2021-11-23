import express from 'express';
import {
	editEvent,
	getSingleUserEvents,
} from '../../../app/controllers/eventController';
import { editNews } from '../../../app/controllers/newsController';
import {
	addToContacts,
	changeMentorShipProfile,
	changePreferences,
	editAddWorkExperience,
	editProfile,
	editWorkOption,
	removeFromContacts,
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
router.get('/:userId/events', protect, getSingleUserEvents);
router.put('/:userId/events/:eventId', protect, editEvent);
router.put('/:userId/news/:newsId', protect, editNews);
router.put('/:userId/contacts/add', protect, addToContacts);
router.put('/:userId/contacts/remove', protect, removeFromContacts);

export default router;
