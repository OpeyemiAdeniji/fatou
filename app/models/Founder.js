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
			required: [true, 'A stage is required'],
		},
		category: {
			type: String,
			required: [true, 'A category is required'],
		},
		company: {
			type: mongoose.Schema.ObjectId,
			ref: 'Company',
			required: true,
		},
		hqLocation: {
			type: String,
			required: [true, 'A founder HQ is required'],
		},
		year: {
			type: Date,
			required: [true, 'A founding year is required'],
		},
		foundingTeam: {
			type: [String],
			required: [true, 'A founding team is required'],
		},
		mediaSpotlight: {
			type: [String],
		},
		approved: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Founder', FounderSchema);
