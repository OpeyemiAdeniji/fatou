import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserProfile',
			required: [true, 'a user is required'],
		},
		comment: {
			type: String,
		},
		replies: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'UserProfile',
				},
				message: String,
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
