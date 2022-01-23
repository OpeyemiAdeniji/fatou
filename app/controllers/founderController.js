import { errorResponse, successResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';

// models
import Founder from '../models/Founder';

// eslint-disable-next-line no-unused-vars
export const createFounder = asyncHandler(async (req, res, next) => {
	await req.validate({
		user: 'required|string|exists:user,_id',
		stage: 'required|string',
		category: 'required|string',
		company: 'required|string|exists:company,_id',
	});

	const founder = await Founder.create(req.body, { new: true, runValidators: true });

	successResponse(res, 'Founder created successfully', founder, 201);
});

// eslint-disable-next-line no-unused-vars
export const updateFounder = asyncHandler(async (req, res, next) => {
	await req.validate({
		user: 'required|string|exists:user,_id',
		stage: 'required|string',
		category: 'required|string',
		company: 'required|string|exists:company,_id',
	});

	let founder = await Founder.findById(req.params.founderId);

	if (!founder.user._id.equals(req.user._id)) {
		return errorResponse(next, 'Not authorized to update this founder', 401);
	}

	const founderToUpdate = await Founder.findByIdAndUpdate(req.params.founderId, req.body, {
		new: true,
		runValidators: true,
	});

	successResponse(res, 'Founder updated successfully', founderToUpdate);
});

// eslint-disable-next-line no-unused-vars
export const getAllFounders = asyncHandler(async (req, res, next) => {
	res.advancedResults(Founder);
});

// eslint-disable-next-line no-unused-vars
export const getSingleFounder = asyncHandler(async (req, res, next) => {
	const founder = await Founder.findById(req.params.founderId);

	successResponse(res, 'Founder retrieved successfully', founder);
});

// eslint-disable-next-line no-unused-vars
export const deleteFounder = asyncHandler(async (req, res, next) => {
	await Founder.deleteOne({ _id: req.params.founderId });

	successResponse(res, 'Founder deleted successfully', {});
});
