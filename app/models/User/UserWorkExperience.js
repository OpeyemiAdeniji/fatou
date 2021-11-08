import mongoose from 'mongoose';
import { mentorshipOpportunities } from '../helpers/constants';

const UserWorkExperienceSchema = mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, 'Please add a company name'],
		},
		company2: {
			type: String,
			required: [true, 'Please add a company name'],
		},
		date: {
			start: Date,
			end: Date,
		},
		mentorship: {
			seeking: {
				isSeeking: {
					type: Boolean,
					default: false,
				},
				opportunities: {
					required: [
						function () {
							return this.mentorship.seeking == true;
						},
						'a mentorship opportunity is required',
					],
					type: [String],
					enum: mentorshipOpportunities,
				},
			},
			open: {
				isOpen: {
					type: Boolean,
					default: false,
				},
				opportunities: {
					required: [
						function () {
							return this.mentorship.open == true;
						},
						'a mentorship opportunity is required',
					],
					type: [String],
					enum: mentorshipOpportunities,
				},
			},
		},
	},
	{ timestamps: true }
);

export default mongoose.model('UserWorkExperience', UserWorkExperienceSchema);
