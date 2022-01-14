// import express from 'express';
// import {
// 	approveNews,
// 	createNews,
// 	deleteNews,
// 	disapproveNews,
// 	getAllNews,
// 	getApprovedNews,
// } from '../../../app/controllers/newsController';
// import { protect, admin } from '../../../app/middlewares/auth';

// const router = express.Router();

// router.route('/').post(protect, createNews).get(admin, getAllNews);
// router.delete('/:newsId', protect, deleteNews);
// router.get('/approved', protect, getApprovedNews);
// router.put('/:newsId/approve', admin, approveNews);
// router.put('/:newsId/disapprove', admin, disapproveNews);

// export default router;
