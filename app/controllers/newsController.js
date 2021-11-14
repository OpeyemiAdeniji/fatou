import { errorResponse, successResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';

// libs
import path from 'path';
import fs from 'fs';

// models
import News from '../models/News';

// eslint-disable-next-line no-unused-vars
export const createNews = asyncHandler(async (req, res, next) => {
	await req.validate({
		posterAvatar: 'required|file',
		posterName: 'required|string',
		title: 'required|string',
		body: 'required|string',
		image: 'required|file',
	});

	const { posterName, title, body } = req.body;

	let posterAvatarName;
	let imageName;

	// check for file upload
	if (req.files) {
		// eslint-disable-next-line no-unused-vars
		Object.entries(req.files).forEach(([key, file]) => {
			// check if its an image
			if (!file.mimetype.startsWith('image')) {
				return errorResponse(
					next,
					'file is not an image ' + file.mimetype,
					400
				);
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
			if (key === 'posterAvatar') {
				file.name = `news_poster_${posterName}_${Date.now()}${
					path.parse(file.name).ext
				}`;
			} else {
				file.name = `news_image_${posterName}_${Date.now()}${
					path.parse(file.name).ext
				}`;
			}

			file.mv(
				`${process.env.FILE_UPLOAD_PATH}/news/${file.name}`,
				async (err) => {
					if (err) {
						console.log(err);
						return errorResponse(next, 'problem with file upload', 500);
					}
				}
			);

			if (key === 'posterAvatar') {
				posterAvatarName = file.name;
			} else {
				imageName = file.name;
			}
		});
	}

	const news = await News.create(
		{
			user: req.user._id,
			poster: { avatar: posterAvatarName, name: posterName },
			title,
			body,
			image: imageName,
		},
		{ new: true, runValidators: true }
	);

	successResponse(res, 'news created successfully', news);
});

// eslint-disable-next-line no-unused-vars
export const editNews = asyncHandler(async (req, res, next) => {
	await req.validate({
		posterAvatar: 'required',
		posterName: 'required|string',
		title: 'required|string',
		body: 'required|string',
		image: 'required',
	});

	const { posterName, title, body } = req.body;

	let news = await News.findByIdAndUpdate(
		req.params.newsId,
		{
			title,
			body,
		},
		{ new: true, runValidators: true }
	);

	// check for file upload
	if (req.files) {
		// eslint-disable-next-line no-unused-vars
		Object.entries(req.files).forEach(([key, file]) => {
			// check if its an image
			if (!file.mimetype.startsWith('image')) {
				return errorResponse(
					next,
					'file is not an image ' + file.mimetype,
					400
				);
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
			if (key === 'posterAvatar') {
				file.name = `news_poster_${posterName}_${Date.now()}${
					path.parse(file.name).ext
				}`;
			} else {
				file.name = `news_image_${posterName}_${Date.now()}${
					path.parse(file.name).ext
				}`;
			}

			file.mv(
				`${process.env.FILE_UPLOAD_PATH}/news/${file.name}`,
				async (err) => {
					if (err) {
						console.log(err);
						return errorResponse(next, 'problem with file upload', 500);
					}
				}
			);

			if (key === 'posterAvatar') {
				// check if photo is available
				if (news.poster.avatar != null) {
					fs.unlink(
						`${process.env.FILE_UPLOAD_PATH}/events/${news.poster.avatar}`,
						(err) => {
							if (err) {
								// return next(new ErrorResponse("problem deleting image", 500));
								console.log('avatar not found');
							}
						}
					);
				}
				news.poster = { posterAvatar: file.name, name: posterName };
			} else {
				if (news.image != null) {
					fs.unlink(
						`${process.env.FILE_UPLOAD_PATH}/events/${news.image}`,
						(err) => {
							if (err) {
								// return next(new ErrorResponse("problem deleting image", 500));
								console.log('image not found');
							}
						}
					);
				}
				news.image = file.name;
			}
		});
		await news.save();
		news = await News.findById(req.params.newsId);
	}

	successResponse(res, 'news updated successfully', news);
});

// eslint-disable-next-line no-unused-vars
export const getApprovedNews = asyncHandler(async (req, res, next) => {
	req.query = { ...req.query, approved: true };
	res.advancedResults(News);
});

// eslint-disable-next-line no-unused-vars
export const getAllNews = asyncHandler(async (req, res, next) => {
	res.advancedResults(News);
});

// eslint-disable-next-line no-unused-vars
export const deleteNews = asyncHandler(async (req, res, next) => {
	await req.validate({
		newsId: 'required|string|exists:news,_id',
	});

	const news = await News.findById(req.params.newsId);

	if (news.poster && news.poster.avatar != null) {
		fs.unlink(`${process.env.FILE_UPLOAD_PATH}/events/${news.image}`, (err) => {
			if (err) {
				// return next(new ErrorResponse("problem deleting image", 500));
				console.log('image not found');
			}
		});
	}
	if (news.image != null) {
		fs.unlink(`${process.env.FILE_UPLOAD_PATH}/events/${news.image}`, (err) => {
			if (err) {
				// return next(new ErrorResponse("problem deleting image", 500));
				console.log('image not found');
			}
		});
	}

	await News.deleteOne({ _id: req.params.newsId });

	successResponse(res, 'news deleted successfully', {});
});

// eslint-disable-next-line no-unused-vars
export const approveNews = asyncHandler(async (req, res, next) => {
	await req.validate({
		newsId: 'required|string|exists:news,_id',
	});

	const news = await News.findByIdAndUpdate(
		req.params.newsId,
		{
			approved: true,
		},
		{ new: true }
	);

	successResponse(res, 'news deleted successfully', news);
});

// eslint-disable-next-line no-unused-vars
export const disapproveNews = asyncHandler(async (req, res, next) => {
	await req.validate({
		newsId: 'required|string|exists:news,_id',
	});

	const news = await News.findByIdAndUpdate(
		req.params.newsId,
		{
			approved: false,
		},
		{ new: true }
	);

	successResponse(res, 'news deleted successfully', news);
});

// eslint-disable-next-line no-unused-vars
export const getSingleUserNews = asyncHandler(async (req, res, next) => {
	req.query = { ...req.query, user: req.user._id };
	res.advancedResults(News);
});
