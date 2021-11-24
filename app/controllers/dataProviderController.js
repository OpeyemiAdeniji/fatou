import asyncHandler from '../middlewares/async';
import { successResponse } from '../helpers/response';

import schools from '../../data/universities.json';


// eslint-disable-next-line no-unused-vars
export const fetchWorldUniversitied = asyncHandler(async (req, res, next) => {
	const universities = schools;
	successResponse(res, 'found', universities);
});