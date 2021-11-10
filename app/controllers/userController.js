import asyncHandler from '../middlewares/async';
import { errorResponse, successResponse } from '../helpers/response';

// libs
import path from 'path';
import fs from 'fs';

//models
import User from '../models/User/UserProfile';

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


   let user =  await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true,
    });

    // check for file upload
    if(req.files) {
      
        const file = req.files.photo;
        // check if its an image
        if (!file.mimetype.startsWith('image')) {
            return errorResponse(next, 'file is not an image '+file.mimetype, 400);
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
        file.name = `profile/user_${user.firstName}_${Date.now()}${path.parse(file.name).ext}`;
      
        file.mv(
        `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
            async (err) => {
            if (err) {
            // console.log(err);
            return errorResponse(next, 'problem with file upload', 500);
            }
      
            let photo = file.name;
      
            // check if photo is available
            if (user.avatar != null) {
                fs.unlink(
                `${process.env.FILE_UPLOAD_PATH}/${user.avatar}`,
                (err) => {
                if (err) {
                    // return next(new ErrorResponse("problem deleting image", 500));
                    console.log('image not found')
                    }
                }
                );
            }
      
            user.avatar = photo;
            await user.save();
        }
        );
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

});

// eslint-disable-next-line no-unused-vars
export const addWorkOption = asyncHandler(async (req, res, next) => {
});
