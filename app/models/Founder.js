import mongoose from 'mongoose';

const FounderSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		company: {
			type: mongoose.Schema.ObjectId,
			ref: 'Company',
			required: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Founder', FounderSchema);
