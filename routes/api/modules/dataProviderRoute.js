import express from 'express';
import {
    fetchWorldUniversitied
} from '../../../app/controllers/dataProviderController';
import { protect } from '../../../app/middlewares/auth';

const router = express.Router();

router.get('/universities', protect, fetchWorldUniversitied);

export default router;
