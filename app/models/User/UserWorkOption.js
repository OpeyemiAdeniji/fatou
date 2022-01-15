import mongoose from 'mongoose';

const UserWorkOptionSchema = mongoose.Schema(
	{	
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserProfile',
            required: true,
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
			// type: String
			type: Boolean,
			default: false,
		},
		salaryRange: {
			type: String,
			trim: true
		},
		resumeUrl: {
			type: String
		}
	},
	{ timestamps: true }
);

export default mongoose.model('UserWorkOption', UserWorkOptionSchema);
