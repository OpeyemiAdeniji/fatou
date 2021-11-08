import mongoose from 'mongoose';

const NewsSchema = mongoose.Schema(
	{
		poster: {
			avatar: {
				type: String,
				required: [true, 'A news poster avatar is required'],
			},
			name: {
				type: String,
				required: [true, 'A news poster name is required'],
			},
		},
		title: {
			type: String,
			required: [true, 'A news title is required'],
		},
		body: {
			type: String,
			required: [true, 'A news body is required'],
		},
		image: {
			type: String,
			required: [true, 'A news image is required'],
		},
	},
	{ timestamps: true }
);

export default mongoose.model('News', NewsSchema);
