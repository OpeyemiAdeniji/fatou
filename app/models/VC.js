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
		averageCheckSize: {
			type: String,
			required: [true, 'An average check size is required'],
			enum: [
				'50K-100K',
				'10k-50k ',
				'100-250K',
				'250-500K',
				'1M-5M',
				'5M-10M',
				'10M-20M',
				'10M-20M',
				'20M-50M',
				'UNCAPPED',
			],
		},
		website: {
			type: String,
			match: [
				/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
				'Please add a valid website URL',
			],
		},
		social: {
			facebook: {
				type: String,
				match: [
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
					'Please add a valid URL',
				],
			},
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
			crunchbase: {
				type: String,
				match: [
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
					'Please add a valid URL',
				],
			},
		},
		approved: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('VC', VCSchema);
