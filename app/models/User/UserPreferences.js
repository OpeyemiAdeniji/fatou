import mongoose from 'mongoose';

const UserPreferencesSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserProfile',
            required: true,
		},
		receiveEmails: {
			partners: {
				type: Boolean,
				default: false,
			},
			blackpeer: {
				type: Boolean,
				default: false,
			},
			message: {
				type: Boolean,
				default: false,
			},
			answer: {
				type: Boolean,
				default: false,
			},
			jobPosts: {
				type: Boolean,
				default: false,
			},
			newMessages: {
				type: Boolean,
				default: false,
			},
			newPosts: {
				type: Boolean,
				default: false,
			}
		},
		accountActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('UserPreferences', UserPreferencesSchema);
