import mongoose from 'mongoose';

const FounderSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		stage: {
			type: String,
			required: [true, ' A stage is required'],
		},
		category: {
			type: String,
			required: [true, ' A category is required'],
		},
		company: {
			type: mongoose.Schema.ObjectId,
			ref: 'Company',
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Founder', FounderSchema);
