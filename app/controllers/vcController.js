import { errorResponse, successResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';

// models
import VC from '../models/VC';
import { deleteExistingFile, storeVcImage, updateVcImage } from '../services/storage';

// eslint-disable-next-line no-unused-vars
export const createVC = asyncHandler(async (req, res, next) => {
	await req.validate({
		logo: 'required|file|mime:image',
		name: 'required|string',
		description: 'required|string',
		location: 'required|string',
		category: 'required|string',
		'fund.from': 'required|string',
		'fund.to': 'required|string',
		'social.instagram': 'string|url',
		'social.twitter': 'string|url',
		'social.linkedIn': 'string|url',
	});

	const Vc = await VC.create(req.body, { new: true, runValidators: true });

	const fileStore = storeVcImage(req.files.logo, Vc);

	if (!fileStore.status) {
		return errorResponse(next, fileStore.error, 500);
	}

	Vc.logo = fileStore.name;
	await Vc.save();

	successResponse(res, 'VC created successfully', Vc);
});

// eslint-disable-next-line no-unused-vars
export const updateVC = asyncHandler(async (req, res, next) => {
	await req.validate({
		logo: 'file|mime:image',
		name: 'required|string',
		description: 'required|string',
		location: 'required|string',
		category: 'required|string',
		'fund.from': 'required|string',
		'fund.to': 'required|string',
		'social.instagram': 'string|url',
		'social.twitter': 'string|url',
		'social.linkedIn': 'string|url',
	});

	const Vc = await VC.findByIdAndUpdate(req.params.vcId, req.body, { new: true, runValidators: true });

	const fileStore = updateVcImage(req.files.logo, Vc);

	if (!fileStore.status) {
		return errorResponse(next, fileStore.error, 500);
	}

	Vc.logo = fileStore.name;
	await Vc.save();

	successResponse(res, 'VC updated successfully', Vc);
});

// eslint-disable-next-line no-unused-vars
export const getAllVCs = asyncHandler(async (req, res, next) => {
	res.advancedResults(VC);
});

// eslint-disable-next-line no-unused-vars
export const getSingleVC = asyncHandler(async (req, res, next) => {
	const Vc = await VC.findById(req.params.vcId);

	successResponse(res, 'VC retrieved successfully', Vc);
});

// eslint-disable-next-line no-unused-vars
export const deleteSingleVC = asyncHandler(async (req, res, next) => {
	const Vc = await VC.findById(req.params.vcId);

	deleteExistingFile(Vc.logo, 'vc');

	await VC.deleteOne({ _id: Vc._id });

	successResponse(res, 'VC deleted successfully', {});
});
