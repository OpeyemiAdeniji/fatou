import mongoose from 'mongoose';

const UserWorkOptionSchema = mongoose.Schema(
	{	
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserProfile',
            required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		looking: {
			type: Boolean,
			default: false,
		},
		openToWorkBanner: {
			type: Boolean,
			default: false,
		},
		openToWorkRemotely: {
			type: Boolean,
			default: false,
		},
		preferredLocation: {
			type: [String]
		},
		yearsOfExperience: {
			type: Number
		},
		seeking: {
			type: String,
			enum: ['visa', 'sponsorship', 'none'],
			default: 'none'
		},
		salaryRange: Number,
		resumeUrl: {
			type: String
		}
	},
	{ timestamps: true }
);

export default mongoose.model('UserWorkOption', UserWorkOptionSchema);
