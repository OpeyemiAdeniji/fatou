import asyncHandler from '../middlewares/async';
import { errorResponse, successResponse } from '../helpers/response';

// libs
import path from 'path';
import fs from 'fs';

//models
import User from '../models/User/UserProfile';
import UserWorkExperience from '../models/User/UserWorkExperience';
import UserWorkOption from '../models/User/UserWorkOption';
import UserPreferences from '../models/User/UserPreferences';
import MentorShip from '../models/User/MentorShip';

// eslint-disable-next-line no-unused-vars
export const editProfile = asyncHandler(async (req, res, next) => {
	await req.validate({
		firstName: 'required|string',
		lastName: 'required|string',
		pronouns: 'required|string',
		phone: 'required|string',
		company: 'required|string',
		jobTitle: 'required|string',
		industry: 'required|string',
		sector: 'required|string',
		college: 'required|string',
		highestEducation: 'required|string',
		linkedInUrl: 'required|string|url',
		website: 'string|url',
		'address.country': 'required|string',
		'address.state': 'required|string',
		'address.city': 'required|string',
	});

	let user = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	// check for file upload
	if (req.files) {
		const file = req.files.photo;
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
		file.name = `profile/user_${user.firstName}_${Date.now()}${
			path.parse(file.name).ext
		}`;

		file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
			if (err) {
				// console.log(err);
				return errorResponse(next, 'problem with file upload', 500);
			}

			let photo = file.name;

			// check if photo is available
			if (user.avatar != null) {
				fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${user.avatar}`, (err) => {
					if (err) {
						// return next(new ErrorResponse("problem deleting image", 500));
						console.log('image not found');
					}
				});
			}

			user.avatar = photo;
			await user.save();
		});
	}

	successResponse(res, 'ok', {});
});

// eslint-disable-next-line no-unused-vars
export const editAddWorkExperience = asyncHandler(async (req, res, next) => {
	await req.validate({
		company: 'required|string',
		title: 'required|string',
		'date.start': 'required|date',
		'date.end': 'required|date',
	});

	const { company, title, date } = req.body;

	let experience;

	if (req.params.experienceId != null) {
		// get and update work experience
		experience = await UserWorkExperience.findById(req.params.experienceId);
		experience.company = company;
		experience.title = title;
		experience.date.start = date.start;
		experience.date.end = date.end;

		await experience.save();
	} else {
		// create new work experience
		experience = await UserWorkExperience.create({
			user: req.user.id,
			company,
			title,
			date,
		});
	}

	successResponse(res, 'ok', { experience });
});

// eslint-disable-next-line no-unused-vars
export const editWorkOption = asyncHandler(async (req, res, next) => {
	await req.validate({
		looking: 'required|boolean',
		open: 'required|boolean',
		preferredLocation: 'required|string',
		yearsOfExperience: 'required|numeric',
		seeking: 'required|string',
		salary: 'required|numeric',
		skills: 'required|array',
	});

	const {
		looking,
		open,
		preferredLocation,
		yearsOfExperience,
		seeking,
		salary,
		skills,
	} = req.body;

	// create user workoption or update
	let workOption = await UserWorkOption.findOne({ user: req.user.id });

	if (workOption) {
		workOption.looking = looking;
		workOption.open = open;
		workOption.preferredLocation = preferredLocation;
		workOption.yearsOfExperience = yearsOfExperience;
		workOption.seeking = seeking;
		workOption.salary = salary;
		workOption.skills = skills;

		await workOption.save();
	} else {
		workOption = await UserWorkOption.create({
			user: req.user.id,
			looking,
			open,
			preferredLocation,
			yearsOfExperience,
			seeking,
			salary,
			skills,
		});
	}

	successResponse(res, 'work option successfully updated', { workOption });
});

// eslint-disable-next-line no-unused-vars
export const changePreferences = asyncHandler(async (req, res, next) => {
	await req.validate({
		'receiveEmails.partners': 'required|boolean',
		'receiveEmails.blackpeer': 'required|boolean',
		'receiveEmails.message': 'required|boolean',
		'receiveEmails.answer': 'required|boolean',
	});

	const { receiveEmails } = req.body;

	let userPreferences = await UserPreferences.findOne({ user: req.user.id });

	if (userPreferences) {
		userPreferences.receiveEmails.partners = receiveEmails.partners;
		userPreferences.receiveEmails.blackpeer = receiveEmails.blackpeer;
		userPreferences.receiveEmails.message = receiveEmails.message;
		userPreferences.receiveEmails.answer = receiveEmails.answer;

		await userPreferences.save();
	} else {
		userPreferences = await UserPreferences.create({
			user: req.user.id,
			receiveEmails,
		});
	}

	successResponse(res, 'settings successfully updated', { userPreferences });
});

// eslint-disable-next-line no-unused-vars
export const changeMentorShipProfile = asyncHandler(async (req, res, next) => {
	await req.validate({
		'seeking.seek': 'required|boolean',
		'seeking.opportunities': 'required|array',
		'open.open': 'required|boolean',
		'open.opportunities': 'required|array',
	});

	const { seeking, open } = req.body;

	let mentorshipProfile = await MentorShip.findOne({ user: req.user.id });

	if (mentorshipProfile) {
		// check seeking
		if (seeking.seek) {
			mentorshipProfile.mentorship.isSeeking = true;
			mentorshipProfile.mentorship.opportunities = seeking.opportunities;
		} else {
			mentorshipProfile.mentorship.isSeeking = false;
			mentorshipProfile.mentorship.opportunities = [];
		}

		if (seeking.open) {
			mentorshipProfile.open.isOpen = true;
			mentorshipProfile.open.opportunities = open.opportunities;
		} else {
			mentorshipProfile.open.isOpen = false;
			mentorshipProfile.open.opportunities = [];
		}

		await mentorshipProfile.save();
	} else {
		mentorshipProfile = new MentorShip();
		mentorshipProfile.user = req.user.id;

		if (seeking.seek) {
			mentorshipProfile.mentorship.isSeeking = true;
			mentorshipProfile.mentorship.opportunities = seeking.opportunities;
		} else {
			mentorshipProfile.mentorship.isSeeking = false;
			mentorshipProfile.mentorship.opportunities = [];
		}

		if (seeking.open) {
			mentorshipProfile.open.isOpen = true;
			mentorshipProfile.open.opportunities = open.opportunities;
		} else {
			mentorshipProfile.open.isOpen = false;
			mentorshipProfile.open.opportunities = [];
		}

		await mentorshipProfile.save();
	}

	successResponse(res, 'mentorship successfully updated', {
		mentorshipProfile,
	});
});

// eslint-disable-next-line no-unused-vars
export const addToContacts = asyncHandler(async (req, res, next) => {
	await req.validate({
		contactId: 'required|string|exists:user,_id',
	});

	let user = req.user;

	user.contacts = [req.body.contactId, ...user.contacts];
	user.save();

	user = await User.findById(user._id);

	successResponse(res, 'contact added successfully', { user });
});

// eslint-disable-next-line no-unused-vars
export const removeFromContacts = asyncHandler(async (req, res, next) => {
	await req.validate({
		contactId: 'required|string|exists:user,_id',
	});

	let user = req.user;

	user.contacts = user.contacts.map((contact) => contact != req.body.contactId);
	user.save();

	user = await User.findById(user._id);

	successResponse(res, 'contact removed successfully', { user });
});
