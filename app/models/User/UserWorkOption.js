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
		open: {
			type: Boolean,
			default: false,
		},
		preferredLocation: {
			type: String,
			// required: [true, 'Please add a location'],
		},
		yearsOfExperience: {
			type: Number,
			// required: [true, 'Please add a number of years'],
		},
		seeking: {
			type: String,
			// required: [true, 'Please add a seeking type'],
		},
		salary: {
			type: Number,
			min: [1, 'Minimum salary cannot be lower than one'],
		},
		resumeUrl: {
			type: String
		},
		skills: {
			type: [String]
		},
	},
	{ timestamps: true }
);

export default mongoose.model('UserWorkOption', UserWorkOptionSchema);
