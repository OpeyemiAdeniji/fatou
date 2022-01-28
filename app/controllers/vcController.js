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
		averageCheckSize:
			'required|string|in:50K-100K,10k-50k ,100-250K,250-500K,1M-5M,5M-10M,10M-20M,10M-20M,20M-50M,UNCAPPED',
		website: 'string|url',
		'social.facebook': 'string|url',
		'social.instagram': 'string|url',
		'social.twitter': 'string|url',
		'social.linkedIn': 'string|url',
		'social.crunchbase': 'string|url',
	});

	const fields = req.validated();

	const Vc = await VC.create(fields, { new: true, runValidators: true });

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
		averageCheckSize:
			'required|string|in:50K-100K,10k-50k ,100-250K,250-500K,1M-5M,5M-10M,10M-20M,10M-20M,20M-50M,UNCAPPED',
		website: 'string|url',
		'social.facebook': 'string|url',
		'social.instagram': 'string|url',
		'social.twitter': 'string|url',
		'social.linkedIn': 'string|url',
		'social.crunchbase': 'string|url',
	});

	const fields = req.validated();

	const Vc = await VC.findByIdAndUpdate(req.params.vcId, fields, {
		new: true,
		runValidators: true,
	});

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
export const getAllApprovedVCs = asyncHandler(async (req, res, next) => {
	req.query = { ...req.query, approved: true };
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