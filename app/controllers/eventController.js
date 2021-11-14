import { errorResponse, successResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';

// libs
import path from 'path';
import fs from 'fs';

// models
import Event from '../models/Event';

// eslint-disable-next-line no-unused-vars
export const createEvent = asyncHandler(async (req, res, next) => {
	await req.validate({
		posterName: 'required|string',
		posterEmail: 'required|email',
		name: 'required|string',
		url: 'required|url',
		startDate: 'required|date',
		endDate: 'required|date',
		time: 'string',
		admission: 'string|in:Free,Paid',
		logo: 'file',
		description: 'required|string',
	});

	const {
		posterName,
		posterEmail,
		name,
		url,
		startDate,
		endDate,
		time,
		admission,
		description,
	} = req.body;

	let logoName;

	// check for file upload
	if (req.files) {
		const file = req.files.logo;
		// check if its an image
		if (!file.mimetype.startsWith('image')) {
			return errorResponse(next, 'file is not an image ' + file.mimetype, 400);
		}

		// check file size
		if (file.size > process.env.MAX_FILE_UPLOAD) {
			return errorResponse(
				next,
				`image size exceeds ${process.env.MAX_FILE_UPLOAD}`,
				400
			);
		}

		//  create custom file name
		file.name = `event_${name}_${Date.now()}${path.parse(file.name).ext}`;

		file.mv(
			`${process.env.FILE_UPLOAD_PATH}/events/${file.name}`,
			async (err) => {
				if (err) {
					console.log(err);
					return errorResponse(next, 'problem with file upload', 500);
				}
			}
		);

		logoName = file.name;
	}

	const event = await Event.create({
		user: req.user._id,
		poster: { name: posterName, email: posterEmail },
		name,
		url,
		date: { start: startDate, end: endDate },
		time,
		admission,
		logo: logoName,
		description,
	});

	successResponse(res, 'event created successfully', event);
});

// eslint-disable-next-line no-unused-vars
export const editEvent = asyncHandler(async (req, res, next) => {
	await req.validate({
		eventId: 'required|string|exists:event,_id',
		posterName: 'required|string',
		posterEmail: 'required|email',
		name: 'required|string',
		url: 'required|url',
		startDate: 'required|date',
		endDate: 'required|date',
		time: 'string',
		admission: 'string|in:Free,Paid',
		description: 'required|string',
	});

	const {
		posterName,
		posterEmail,
		name,
		url,
		startDate,
		endDate,
		time,
		admission,
		description,
	} = req.body;

	let event = await Event.findByIdAndUpdate(
		req.params.eventId,
		{
			poster: { name: posterName, email: posterEmail },
			name,
			url,
			date: { start: startDate, end: endDate },
			time,
			admission,
			description,
		},
		{ new: true, runValidators: true }
	);

	// check for file upload
	if (req.files) {
		const file = req.files.logo;
		// check if its an image
		if (!file.mimetype.startsWith('image')) {
			return errorResponse(next, 'file is not an image ' + file.mimetype, 400);
		}

		// check file size
		if (file.size > process.env.MAX_FILE_UPLOAD) {
			return errorResponse(
				next,
				`image size exceeds ${process.env.MAX_FILE_UPLOAD}`,
				400
			);
		}

		//  create custom file name
		file.name = `event_${name}_${Date.now()}${path.parse(file.name).ext}`;

		file.mv(
			`${process.env.FILE_UPLOAD_PATH}/events/${file.name}`,
			async (err) => {
				if (err) {
					return errorResponse(next, 'problem with file upload', 500);
				}
			}
		);

		// check if photo is available
		if (event.logo != null) {
			fs.unlink(
				`${process.env.FILE_UPLOAD_PATH}/events/${event.logo}`,
				(err) => {
					if (err) {
						// return next(new ErrorResponse("problem deleting image", 500));
						console.log('logo not found');
					}
				}
			);
		}

		event.logo = file.name;
		await event.save();
		event = await event.findById(req.params.eventId);
	}

	successResponse(res, 'event updated successfully', event);
});

// eslint-disable-next-line no-unused-vars
export const getApprovedEvents = asyncHandler(async (req, res, next) => {
	req.query = { ...req.query, approved: true };
	res.advancedResults(Event);
});

// eslint-disable-next-line no-unused-vars
export const getAllEvents = asyncHandler(async (req, res, next) => {
	res.advancedResults(Event);
});

// eslint-disable-next-line no-unused-vars
export const getSingleUserEvents = asyncHandler(async (req, res, next) => {
	req.query = { ...req.query, user: req.user._id };
	res.advancedResults(Event);
});

// eslint-disable-next-line no-unused-vars
export const approveEvent = asyncHandler(async (req, res, next) => {
	await req.validate({
		eventId: 'required|string|exists:event,_id',
	});

	let event = await Event.findByIdAndUpdate(
		req.params.eventId,
		{ approved: true },
		{ new: true }
	);

	successResponse(res, 'event approved successfully', event);
});

// eslint-disable-next-line no-unused-vars
export const disapproveEvent = asyncHandler(async (req, res, next) => {
	await req.validate({
		eventId: 'required|string|exists:event,_id',
	});

	let event = await Event.findByIdAndUpdate(
		req.params.eventId,
		{ approved: false },
		{ new: true }
	);

	successResponse(res, 'event disapproved successfully', event);
});
