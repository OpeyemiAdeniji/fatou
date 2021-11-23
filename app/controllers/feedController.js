import { errorResponse, successResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';

// libs
import path from 'path';
import fs from 'fs';

//models
import Feed from '../models/Feed';

// eslint-disable-next-line no-unused-vars
export const createFeedPost = asyncHandler(async (req, res, next) => {
	await req.validate({
		topic:
			'required|in:job,legal,finance,data-science,engineering,news,company-warning,advice',
		body: 'required|string',
		postAnonymously: 'boolean',
		image: 'file',
	});

	let user = req.user;
	const { topic, body, postAnonymously } = req.body;

	let feed = await Feed.create({
		poster: user,
		topic,
		body,
		postAnonymously,
	});

	// check for file upload
	if (req.files.image) {
		let file = req.files.image;

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
		file.name = `feed_${feed._id}_${Date.now()}${path.parse(file.name).ext}`;

		file.mv(
			`${process.env.FILE_UPLOAD_PATH}/feed/${file.name}`,
			async (err) => {
				if (err) {
					console.log(err);
					return errorResponse(next, 'problem with file upload', 500);
				}
			}
		);

		feed.image = file.name;
		await feed.save();
	}

	successResponse(res, 'feed post created successfully', { feed });
});

// eslint-disable-next-line no-unused-vars
export const editFeedPost = asyncHandler(async (req, res, next) => {
	await req.validate({
		feedId: 'required|string|exists:feed,_id',
		topic:
			'required|in:job,legal,finance,data-science,engineering,news,company-warning,advice',
		body: 'required|string',
		postAnonymously: 'boolean',
		image: 'file',
	});

	if (!req.user._id.equals(req.params.feedId)) {
		return errorResponse(next, 'you are not authorized to edit this feed', 401);
	}

	const { topic, body, postAnonymously } = req.body;

	let feed = await Feed.findByIdAndUpdate(
		req.params.feedId,
		{ topic, body, postAnonymously },
		{ new: true }
	);

	// check for file upload
	if (req.files.image) {
		let file = req.files.image;

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
		file.name = `feed_${feed._id}_${Date.now()}${path.parse(file.name).ext}`;

		file.mv(
			`${process.env.FILE_UPLOAD_PATH}/feed/${file.name}`,
			async (err) => {
				if (err) {
					console.log(err);
					return errorResponse(next, 'problem with file upload', 500);
				}
			}
		);

		if (feed.image) {
			const oldImagePath = `${process.env.FILE_UPLOAD_PATH}/feed/${feed.image}`;
			fs.unlink(oldImagePath, (err) => {
				if (err) {
					console.log(err);
					return errorResponse(next, 'problem with file upload', 500);
				}
			});
		}

		feed.image = file.name;
		await feed.save();
	}

	successResponse(res, 'success', {});
});

// eslint-disable-next-line no-unused-vars
export const getAllFeedPosts = asyncHandler(async (req, res, next) => {
	return res.advancedResults(Feed, 'poster comments reactions');
});

// eslint-disable-next-line no-unused-vars
export const getSingleFeedPost = asyncHandler(async (req, res, next) => {
	await req.validate({
		feedId: 'required|string|exists:feed,_id',
	});

	const feed = await Feed.findById(req.params.feedId);

	successResponse(res, 'feed post deleted successfully', { feed });
});

// eslint-disable-next-line no-unused-vars
export const deleteFeedPost = asyncHandler(async (req, res, next) => {
	await req.validate({
		feedId: 'required|string|exists:feed,_id',
	});
	let feed = await Feed.findById(req.params.feedId);

	if (feed.image) {
		const oldImagePath = `${process.env.FILE_UPLOAD_PATH}/feed/${feed.image}`;
		fs.unlink(oldImagePath, (err) => {
			if (err) {
				console.log(err);
				return errorResponse(next, 'problem with file upload', 500);
			}
		});
	}

	await Feed.findByIdAndDelete(req.params.feedId);

	successResponse(res, 'feed post deleted successfully', {});
});
