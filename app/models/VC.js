import mongoose from 'mongoose';

const VCSchema = mongoose.Schema(
	{
		logo: {
			type: String,
			required: [true, 'A VC logo is required'],
		},
		name: {
			type: String,
			required: [true, 'A VC name is required'],
		},
		description: {
			type: String,
			required: [true, 'A VC description is required'],
		},
		location: {
			type: String,
			required: [true, 'A VC location is required'],
		},
		category: {
			type: String,
			required: [true, 'A VC category is required'],
		},
		fund: {
			from: {
				type: String,
				required: [true, 'A VC fund minimun value is required'],
			},
			to: {
				type: String,
				required: [true, 'A VC fund maximum value is required'],
			},
		},
		social: {
			instagram: {
				type: String,
				match: [
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
					'Please add a valid URL',
				],
			},
			twitter: {
				type: String,
				match: [
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
					'Please add a valid URL',
				],
			},
			linkedIn: {
				type: String,
				match: [
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
					'Please add a valid URL',
				],
			},
		},
	},
	{ timestamps: true }
);

export default mongoose.model('VC', VCSchema);
