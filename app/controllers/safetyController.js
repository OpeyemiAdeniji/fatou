import asyncHandler from '../middlewares/async';
import { errorResponse, successResponse } from '../helpers/response';

//models
import User from '../models/User/UserProfile';
import DeleteRequest from '../models/DeleteRequest';
import PauseAccount from '../models/PauseAccount';



export const pauseAccount = asyncHandler(async (req, res, next) => {

    // request validation
    await req.validate({
		'takeBreak': 'required|boolean',
		'privacyIssues': 'required|boolean',
		'busyDistracting': 'required|boolean',
        'connectionIssues': 'required|boolean',
		'otherReasons': 'required|string'
	});

    const { takeBreak, privacyIssues, busyDistracting, connectionIssues, otherReasons }  = req.body;

    const fullName = `${req.user.firstName} ${req.user.lastName}`

    await PauseAccount.create({
        takeBreak,
        privacyIssues,
        busyDistracting,
        connectionIssues, 
        otherReasons,
        fullName
    })


	await User.findByIdAndUpdate(req.user.id, {accountPaused: true}, {
			new: true,
			runValidators: true,
	});

	successResponse(res, 'ok', {message: 'Your account has being paused successfully, and would be reactivated your on next sigin'});
});

export const deleteAccount = asyncHandler(async (req, res, next) => {

    // request validation
    await req.validate({
        'email': 'required|string|email',
        'password': 'required|string',
		'notUseful': 'required|boolean',
		'dontUnderstand': 'required|boolean',
		'safetyIssues': 'required|boolean',
        'privacyIssues': 'required|boolean',
		'otherReasons': 'required|string',
	});

    const { email, notUseful, password, dontUnderstand, otherReasons, safetyIssues, privacyIssues }  = req.body;

	// fetch for user
	const userCheck = await User.findOne({ email }).select('+password');

	if (!userCheck) {
		return errorResponse(next, 'invalid credentials', 401);
	}

	// check if password matches
	const isMatch = await userCheck.matchPassword(password);

	if (!isMatch) {
		return errorResponse(next, 'Password is not correct', 401);
	} 

    const fullName = `${req.user.firstName} ${req.user.lastName}`
    
    await DeleteRequest.create({
        privacyIssues,
        email,
        notUseful,
        dontUnderstand, 
        otherReasons,
        fullName,
        safetyIssues
    })

    //TODO: delete other user records and user 
    
    await User.findByIdAndDelete(req.user.id);

	successResponse(res, 'ok', {message: 'Your account has being deleted successfully'});
});