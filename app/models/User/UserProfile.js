import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { educationLevels, industries, sectors } from '../../helpers/constants';

const UserProfileSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			// required: [true, 'Please add a first name'],
		},
		lastName: {
			type: String,
			// required: [true, 'Please add a last name'],
		},
		pronouns: {
			type: String,
		},
		bio: {
			type: String,
		},
		address: {
			country: {
				shortName: String,
				fullName:  String
				// required: [true, 'Please add a country'],
			},
			state: {
				type: String,
				// required: [true, 'Please add a state'],
			},
			city: {
				type: String,
				// required: [true, 'Please add a city'],
			},
		},
		phone: {
			type: String,
			index: {
				unique: true,
				partialFilterExpression: { phone: { $type: 'string' } },
			},
			// required: [true, 'Please add a contact number'],
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a valid email',
			],
		},
		company: {
			type: String,
		},
		jobTitle: {
			type: String,
		},
		industry: {
			type: String,
			enum: industries,
		},
		sector: {
			type: String,
			enum: sectors,
		},
		isCommunityMember: { type: Boolean, default: false},
		reasonForJoining: {
			type: [String],
			enum: ['network', 'seeking-employment', 'seeking-mentor', 'hiring', 'seeking-internship', 'seeking-cofounder', 'becoming-cofounder'],
			required: [true, 'Reason for joining is required']
		},
		college: {
			type: String,
		},
		highestEducation: {
			type: String,
			enum: educationLevels,
		},
		linkedInUrl: {
			type: String,
			match: [
				/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
				'Please add a valid LinkedIn URL',
			],
		},
		website: {
			type: String,
			match: [
				/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
				'Please add a valid website URL',
			],
		},
		password: {
			type: String,
			// required: [true, 'Please add a password'],
			minlength: 6,
			select: false,
		},
		avatar: {
			type: String,
		},
		workExperience: {
			type: [mongoose.Schema.ObjectId],
			ref: 'UserWorkExperience',
		},
		contacts: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'UserProfile',
			},
		],
		groups: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'UserGroup',
			},
		],
		workOption: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserWorkOption',
		},
		favorites: {
			jobs: [
				{
					type: mongoose.Schema.ObjectId,
					ref: 'Job',
				},
			],
		},
		preferences: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserPreferences',
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
		emailVerified: {
			type: Boolean,
			default: false,
		},
		skills: {
			type: [String]
		},
		social: {
			facebook: {
				token: String,
			},
			google: {
				token: String,
			},
			linkedIn: {
				token: String,
			},
		},
		accountPaused: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

//Encrypt password
UserProfileSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Verify if password is valid
UserProfileSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

// Sign JWT and return
UserProfileSchema.methods.getSignedJwtToken = function () {
	return jwt.sign(
		{ id: this._id, userType: this.userType },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	);
};

// Match User entered password to hashed password in database
UserProfileSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserProfileSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set expire
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

export default mongoose.model('UserProfile', UserProfileSchema);
