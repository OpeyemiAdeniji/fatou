import mongoose from 'mongoose';

const UserPreferencesSchema = mongoose.Schema(
	{
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
		},
		accountActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('UserPreferences', UserPreferencesSchema);
