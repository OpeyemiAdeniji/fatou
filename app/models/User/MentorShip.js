import mongoose from 'mongoose';
import { mentorshipOpportunities } from '../helpers/constants';

const UserMentorShipAvailSchema = mongoose.Schema(
	{
        user: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserProfile',
            required: true,
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
							return this.mentorship.seeking.isSeeking == true;
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
							return this.mentorship.open.isOpen == true;
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

export default mongoose.model('MentorShip', UserMentorShipAvailSchema);
