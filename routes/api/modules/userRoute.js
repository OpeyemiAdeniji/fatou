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
	uploadAvatar,
	getPreferences,
	userWorkOptions,
	getUserAllWorkExperience,
	deleteUserWorkExperience,
	getMentorShipProfile,
	editSKills,
	updateAddress
} from '../../../app/controllers/userController';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.use(protect);

router.post('/profile/update', editProfile);
router.post('/profile/address/update', updateAddress);
router.put('/profile/update/avatar', uploadAvatar);
router.put('/profile/update/skills', editSKills)


// settings
router.get('/settings', getPreferences);
router.put('/settings/update', changePreferences);

// mentorship
router.get('/work/mentorship', getMentorShipProfile);
router.put('/work/mentorship', changeMentorShipProfile);

// experience
router.get('/work/experience', getUserAllWorkExperience);
router.post('/work/experience', editAddWorkExperience);
router.put('/work/experience/:experienceId', editAddWorkExperience);
router.delete('/work/experience/:experienceId', deleteUserWorkExperience);


// options
router.get('/work/options', userWorkOptions);
router.put('/work/options', editWorkOption);

// events
router.get('/:userId/events', getSingleUserEvents);
router.put('/:userId/events/:eventId', editEvent);

// news
router.put('/:userId/news/:newsId', editNews);

// contacts
router.put('/:userId/contacts/add', addToContacts);
router.put('/:userId/contacts/remove', removeFromContacts);

export default router;
