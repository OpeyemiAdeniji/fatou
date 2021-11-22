import mongoose from 'mongoose';

const FeedSchema = mongoose.Schema(
	{
		poster: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserProfile',
			required: [true, 'a poster is required'],
		},
		topic: {
			type: String,
			required: [true, 'A topic is required'],
			enum: [
				'job',
				'legal',
				'finance',
				'data-science',
				'engineering',
				'news',
				'company-warning',
				'advice',
			],
		},
		postAnonymously: {
			type: Boolean,
			default: false,
		},
		image: String,
		body: {
			type: String,
			required: [true, 'A feed body is required'],
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: 'Comment',
			},
		],
		reactions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Reaction',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Feed', FeedSchema);
