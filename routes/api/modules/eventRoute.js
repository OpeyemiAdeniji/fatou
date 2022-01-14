// import express from 'express';
// import {
// 	approveEvent,
// 	createEvent,
// 	disapproveEvent,
// 	getAllEvents,
// 	getApprovedEvents,
// } from '../../../app/controllers/eventController';
// import { protect, admin } from '../../../app/middlewares/auth';

// const router = express.Router();

// router.route('/').post(protect, createEvent).get(admin, getAllEvents);
// router.get('/approved', protect, getApprovedEvents);
// router.put('/:eventId/approve', admin, approveEvent);
// router.put('/:eventId/disapprove', admin, disapproveEvent);

// export default router;
