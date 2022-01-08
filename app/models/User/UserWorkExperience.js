import mongoose from 'mongoose';

const UserWorkExperienceSchema = mongoose.Schema(
	{	
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserProfile',
            required: true,
		},
		company: {
			type: String,
			required: [true, 'Please add a company name'],
		},
		title: {
			type: String,
			required: [true, 'Please add a job title'],
		},
		isCurrent: false,
		date: {
			start: String,
			end: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('UserWorkExperience', UserWorkExperienceSchema);
