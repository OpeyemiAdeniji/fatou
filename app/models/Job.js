import mongoose from 'mongoose';

const JobSchema = mongoose.Schema(
	{
		avatar: {
			type: String,
			required: [true, 'A job avatar is required'],
		},
		title: {
			type: String,
			required: [true, 'A job title is required'],
		},
		company: {
			type: mongoose.Schema.ObjectId,
			ref: 'Company',
			required: [true, 'A job company is required'],
		},
		address: {
			type: String,
			required: [true, 'A job address is required'],
		},
		salary: {
			type: String,
			required: [true, 'A job salary is required'],
		},
		employmentType: {
			type: String,
			enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
			required: [true, 'A job employment type is required'],
		},
		applicants: {
			type: Number,
			min: 0,
			default: 0,
		},
		poster: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserProfile',
			required: [true, 'A job poster is required'],
		},
		description: String,
		responsibilities: {
			type: [String],
			required: [true, 'At least one job responsibility is required'],
		},
		requirements: {
			type: [String],
			required: [true, 'At least one job requirement is required'],
		},
		benefits: {
			type: [String],
			required: [true, 'At least one job benefit is required'],
		},
		interviewProcess: [
			{
				title: {
					type: String,
					required: [true, "A job interview process' round title is required"],
				},
				description: {
					type: String,
					required: [
						true,
						"A job interview process' round description is required",
					],
				},
			},
		],
		legalTeamSize: {
			type: Number,
			min: [1, 'Legal team size cannot be less than one'],
		},
		experienceLevel: {
			type: Number,
			min: [1, 'Experience cannot be less than one'],
		},
		industry: {
			type: String,
			required: [true, 'A job industry is required'],
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Job', JobSchema);
