import express from 'express';
const apiRoutes = express.Router();

import advancedResults from '../../app/middlewares/advancedResults';
import fileHandler from '../../app/middlewares/fileHandler';
import validate from '../../app/middlewares/validator';

// add api routes below
import authRouter from './modules/authRoute';
import userRouter from './modules/userRoute';
import eventRouter from './modules/eventRoute';
import newsRouter from './modules/newsRoute';
import feedRouter from './modules/feedRoute';
import dataProviderRoutes from './modules/dataProviderRoutes';


apiRoutes.use(advancedResults);
apiRoutes.use(fileHandler);
apiRoutes.use(validate);

// initialize routes
apiRoutes.use('/auth', authRouter);
apiRoutes.use('/account/user', userRouter);
apiRoutes.use('/events', eventRouter);
apiRoutes.use('/news', newsRouter);
apiRoutes.use('/feeds', feedRouter);
apiRoutes.use('/data/provider', dataProviderRoutes);


export default apiRoutes;
