import mongoose from 'mongoose';

const ReactionSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserProfile',
		},
		reaction: {
			type: String,
			enum: ['like', 'dislike', 'love', 'haha', 'wow', 'sad', 'angry'],
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Reaction', ReactionSchema);
