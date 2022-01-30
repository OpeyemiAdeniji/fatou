import { errorResponse, successResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';
import Company from '../models/Company';

// models
import Founder from '../models/Founder';
import { storeCompanyImage, updateCompanyImage } from '../services/storage';

// eslint-disable-next-line no-unused-vars
export const createFounder = asyncHandler(async (req, res, next) => {
	await req.validate({
		user: 'required|string|exists:user,_id',
		logo: 'required|file',
		email: 'required|email',
		name: 'required|string',
		sector: 'required|string',
		founded: 'required|date',
		foundingRound:
			'required|string|in:Private,Angel,Seed,Series A,Series B,Series C,Series D,Series E,Series F,Public',
		employeeCount: 'required|integer|min:1',
		additionalFounder: 'string',
		bio: 'required|string',
		website: 'string|url',
		facebook: 'string|url',
		instagram: 'string|url',
		twitter: 'string|url',
		linkedIn: 'string|url',
		crunchbase: 'string|url',
		hiring: 'required|boolean',
	});

	const { logo, fields } = req.validated();

	const data = {
		...fields,
		social: {
			facebook: fields.facebook,
			instagram: fields.instagram,
			twitter: fields.twitter,
			linkedIn: fields.linkedIn,
			crunchbase: fields.crunchbase,
		},
	};

	const company = await Company.create(data);

	const fileStore = storeCompanyImage(logo, company);

	if (!fileStore.status) {
		return errorResponse(next, fileStore.error, 500);
	}

	company.logo = fileStore.name;
	await company.save();

	const founder = await Founder.create({ user: fields.user, comapany: company._id });

	successResponse(res, 'Founder created successfully', founder, 201);
});

// eslint-disable-next-line no-unused-vars
export const updateFounder = asyncHandler(async (req, res, next) => {
	await req.validate({
		logo: 'file',
		email: 'required|email',
		name: 'required|string',
		sector: 'required|string',
		founded: 'required|date',
		foundingRound:
			'required|string|in:Private,Angel,Seed,Series A,Series B,Series C,Series D,Series E,Series F,Public',
		employeeCount: 'required|integer|min:1',
		additionalFounder: 'string',
		bio: 'required|string',
		website: 'string|url',
		facebook: 'string|url',
		instagram: 'string|url',
		twitter: 'string|url',
		linkedIn: 'string|url',
		crunchbase: 'string|url',
		hiring: 'required|boolean',
	});

	const { logo, fields } = req.validated();

	const data = {
		...fields,
		social: {
			facebook: fields.facebook,
			instagram: fields.instagram,
			twitter: fields.twitter,
			linkedIn: fields.linkedIn,
			crunchbase: fields.crunchbase,
		},
	};

	let founder = await Founder.findById(req.params.founderId);

	if (!founder.user._id.equals(req.user._id)) {
		return errorResponse(next, 'Not authorized to update this founder', 401);
	}

	const company = await Founder.findByIdAndUpdate(founder.company._id, data, {
		new: true,
		runValidators: true,
	});

	if (logo) {
		const fileStore = updateCompanyImage(logo, company);

		if (!fileStore.status) {
			return errorResponse(next, fileStore.error, 500);
		}

		company.logo = fileStore.name;
		await company.save();
	}

	founder = await Founder.findById(req.params.founderId);

	successResponse(res, 'Founder updated successfully', founder);
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

// eslint-disable-next-line no-unused-vars
export const getAllApprovedFounders = asyncHandler(async (req, res, next) => {
	req.query = { ...req.query, approved: true };
	res.advancedResults(Founder);
});
