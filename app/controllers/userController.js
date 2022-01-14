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
        // sector: 'required|string',
        college: 'string',
        highestEducation: 'string',
        linkedInUrl: 'string|url',
        website: 'string|url'
	});

	await User.findByIdAndUpdate(req.user.id, req.body, {
			new: true,
			runValidators: true,
	});

	// let currentWork = await UserWorkExperience.findOne({user: req.user.id, isCurrent: true});

	// if(!currentWork){
	// 	currentWork = await UserWorkExperience.create(
	// 			{
	// 				user: req.user.id, 
	// 				company: req.body.company, 
	// 				title: req.body.jobTitle,
	// 				isCurrent: true
	// 			});
	// }else{ 
	// 	currentWork.company = req.body.company;
	// 	currentWork.title = req.body.jobTitle;

	// 	await currentWork.save();
	// }

	successResponse(res, 'ok', {});
});


// eslint-disable-next-line no-unused-vars
export const updateAddress = asyncHandler(async (req, res, next) => {
	await req.validate({
		'address.country.shortName': 'required|string',
		'address.country.fullName': 'required|string',
		'address.state': 'required|string',
		'address.city': 'required|string'
	});


	await User.findByIdAndUpdate(req.user.id, req.body, {
			new: true,
			runValidators: true,
	});

	successResponse(res, 'ok', {});
});


export const uploadAvatar = asyncHandler(async (req, res, next) => {

	let user = await User.findById(req.user.id);

	if(!user.firstName || !user.lastName) {
		return errorResponse(next, 'please update your profile details', 400);
	}

	// check for file upload

		if (!req.files) {
			return errorResponse(next, 'image avatar is required', 400);
		}
	
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
		file.name = `profile/user_${user.firstName}${user.lastName}_${Date.now()}${
			path.parse(file.name).ext
		}`;

		file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
			if (err) {
				// console.log(err);
				return errorResponse(next, 'problem with file upload', 500);
			}

			let photo = file.name;

			// check if photo is available
			if (user.avatar != null || user.avatar != '') {
				fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${user.avatar}`, (err) => {
					if (err) {
						// return next(new ErrorResponse("problem deleting image", 500));
						console.log('image not found');
					}
				});
			}

			user.avatar = photo;
			await user.save();


			return successResponse(res, 'upload success', {});
		});

});

// eslint-disable-next-line no-unused-vars
export const getUserAllWorkExperience = asyncHandler(async (req, res, next) => {
	// get user all experiences
	let experiences = await UserWorkExperience.find({user: req.user.id});

	successResponse(res, 'ok', { experiences });
});


// eslint-disable-next-line no-unused-vars
export const deleteUserWorkExperience = asyncHandler(async (req, res, next) => {
	// get user all experiences
	await UserWorkExperience.findOneAndDelete({user: req.user.id, _id: req.params.experienceId});

	successResponse(res, 'ok', { });
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
export const userWorkOptions = asyncHandler(async (req, res, next) => {
											
	// get user workoption or update
	let workOption = await UserWorkOption.findOne({ user: req.user.id });

	if(!workOption){
		workOption = null
	}

	successResponse(res, 'ok', { workOption });
});


// eslint-disable-next-line no-unused-vars
export const editSKills = asyncHandler(async (req, res, next) => {
	await req.validate({
		skills: 'required|array'
	});

	const {
		skills,
	} = req.body;

	let  user = await User.findById(req.user.id);

	user.skills =  skills;

	await user.save();


	successResponse(res, 'skills successfully updated', {  });
});



// eslint-disable-next-line no-unused-vars
export const editWorkOption = asyncHandler(async (req, res, next) => {
	await req.validate({
		looking: 'required|boolean',
		openToWorkBanner: 'required|boolean',
		openToWorkRemotely: 'required|boolean',
		preferredLocation: 'required|string',
		yearsOfExperience: 'required|numeric',
		seeking: 'required|string',
		salaryRange: 'required|string'
	});

	const {
		looking,
		openToWorkBanner,
		preferredLocation,
		yearsOfExperience,
		seeking,
		salaryRange,
		openToWorkRemotely
	} = req.body;

	// create user workoption or update
	let workOption = await UserWorkOption.findOne({ user: req.user.id });

	if (workOption) {
		workOption.looking = looking;
		workOption.open = openToWorkBanner;
		workOption.preferredLocation = preferredLocation;
		workOption.yearsOfExperience = yearsOfExperience;
		workOption.seeking = seeking;
		workOption.salaryRange = salaryRange;
		workOption.openToWorkRemotely = openToWorkRemotely

		await workOption.save();
	} else {
		workOption = await UserWorkOption.create({
			user: req.user.id,
			looking,
			openToWorkBanner,
			preferredLocation,
			yearsOfExperience,
			seeking,
			openToWorkRemotely,
			salaryRange,
		});
	}

	// check for resume upload

	if(req.files){
	
		const file = req.files.resume;
		// check if its an image
		if (!file.mimetype.includes('application/pdf')) {
			return errorResponse(next, 'file should be pdf ' + file.mimetype, 400);
		}

		// check file size
		if (file.size > process.env.MAX_FILE_UPLOAD) {
			return errorResponse(
				next,
				`file size exceeds ${process.env.MAX_FILE_UPLOAD}`,
				400
			);
		}

		//  create custom file name
		file.name = `resume/Resume_${req.user.firstName}${req.user.lastName}_${Date.now()}${
			path.parse(file.name).ext
		}`;

	await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
			if (err) {
				// console.log(err);
				return errorResponse(next, 'problem with file upload', 500);
			}

			let resume = file.name;

			// check if photo is available
			if (workOption.resumeUrl != null ||workOption.resumeUrl != '') {
				fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${workOption.resumeUrl}`, (err) => {
					if (err) {
						// return next(new ErrorResponse("problem deleting image", 500));
						console.log('file not found');
					}
				});
			}

			workOption.resumeUrl = resume;
			await workOption.save();
		});

		return successResponse(res, 'upload success', {});
	}

	return successResponse(res, 'work option successfully updated', { workOption });
});

// eslint-disable-next-line no-unused-vars
export const getPreferences = asyncHandler(async (req, res, next) => {
	let userPreferences = await UserPreferences.findOne({ user: req.user.id });

	if(!userPreferences){
		userPreferences = await UserPreferences.create({
			user: req.user.id
		});
	}

	successResponse(res, 'ok', { userPreferences });
});



// eslint-disable-next-line no-unused-vars
export const changePreferences = asyncHandler(async (req, res, next) => {
	await req.validate({
		'receiveEmails.partners': 'required|boolean',
		'receiveEmails.blackpeer': 'required|boolean',
		'receiveEmails.message': 'required|boolean',
		'receiveEmails.answer': 'required|boolean',
		'receiveEmails.newPosts': 'required|boolean',
		'receiveEmails.jobPosts': 'required|boolean',
		'receiveEmails.newMessages': 'required|boolean',
		'receiveEmails.updateAboutFatou': 'required|boolean',
		'receiveEmails.receiveMessageFrom.fromEveryone': 'required|boolean',
		'receiveEmails.receiveMessageFrom.fromNetwork': 'required|boolean',
		'receiveEmails.receiveMessageFrom.oldAccount': 'required|boolean',
	});

	const { receiveEmails } = req.body;

	let userPreferences = await UserPreferences.findOne({ user: req.user.id });

	if (userPreferences) {
		userPreferences.receiveEmails = receiveEmails

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
export const getMentorShipProfile = asyncHandler(async (req, res, next) => {

	let mentorshipProfile = await MentorShip.findOne({ user: req.user.id });

	if (!mentorshipProfile) {
		mentorshipProfile = null
	}

	successResponse(res, 'ok', {
		mentorshipProfile,
	});
});

// eslint-disable-next-line no-unused-vars
export const changeMentorShipProfile = asyncHandler(async (req, res, next) => {
	await req.validate({
		'seeking.seek': 'required|string|in:yes,no',
		'seeking.opportunities': 'array',
		'openTo.open': 'required|string|in:yes,no',
		'openTo.opportunities': 'array',
	});

	const { seeking, openTo } = req.body;

	let mentorshipProfile = await MentorShip.findOne({ user: req.user.id });

	if (mentorshipProfile) {
		// check seeking
		if (seeking.seek === 'yes') {
			mentorshipProfile.seeking.isSeeking = 'yes';
			mentorshipProfile.seeking.opportunities = seeking.opportunities;
		} else {
			mentorshipProfile.seeking.isSeeking = 'no';
			mentorshipProfile.seeking.opportunities = [];
		}

		if (openTo.open === 'yes') {
			mentorshipProfile.open.isOpen = 'yes';
			mentorshipProfile.open.opportunities = openTo.opportunities;
		} else {
			mentorshipProfile.open.isOpen = 'no';
			mentorshipProfile.open.opportunities = [];
		}

		await mentorshipProfile.save();
	} else {
		mentorshipProfile = new MentorShip();
		mentorshipProfile.user = req.user.id;

		if (seeking.seek === 'yes') {
			mentorshipProfile.seeking.isSeeking = 'yes';
			mentorshipProfile.seeking.opportunities = seeking.opportunities;
		} else {
			mentorshipProfile.seeking.isSeeking = 'no';
			mentorshipProfile.seeking.opportunities = [];
		}

		if (openTo.open === 'yes') {
			mentorshipProfile.open.isOpen = 'yes';
			mentorshipProfile.open.opportunities = openTo.opportunities;
		} else {
			mentorshipProfile.open.isOpen = 'no';
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
