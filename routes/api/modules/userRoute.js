import express from 'express';
import {
    changeMentorShipProfile,
    changePreferences,
    editAddWorkExperience,
    editProfile,
    editWorkOption
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


export default router;
