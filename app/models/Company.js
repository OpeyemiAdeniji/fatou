import mongoose from 'mongoose';

const CompanySchema = mongoose.Schema(
	{
		logo: {
			type: String,
			// required: [true, 'A company logo is required'],
		},
		email: {
			type: String,
			required: [true, 'Please add a company email'],
			unique: true,
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
		},
		name: {
			type: String,
			required: [true, 'A company name is required'],
		},
		sector: {
			type: String,
			required: [true, 'A company sector is required'],
		},
		founded: {
			type: Date,
			required: [true, 'A company found date is required'],
		},
		foundingRound: {
			types: String,
			enum: [
				'Private',
				'Angel',
				'Seed',
				'Series A',
				'Series B',
				'Series C',
				'Series D',
				'Series E',
				'Series F',
				'Public',
			],
			required: [true, 'A founding round is required'],
		},
		employeeCount: {
			type: Number,
			min: 1,
			required: [true, 'An employee count is required'],
		},
		additionalFounder: String,
		bio: {
			type: String,
			required: [true, 'A company bio is required'],
		},
		headquarters: {
			type: String,
			// required: [true, 'A company headquarters is required'],
		},
		address: {
			type: String,
			// required: [true, 'A company address is required'],
		},
		phone: {
			type: String,
			// required: [true, 'A company phone is required'],
		},
		type: {
			type: String,
		},
		specialties: {
			type: String,
		},
		website: {
			type: String,
			required: [true, 'A company url is required'],
			match: [
				/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
				'Please add a valid URL',
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
			linkedIn: {
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
			crunchbase: {
				type: String,
				match: [
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
					'Please add a valid URL',
				],
			},
			media: {
				type: String,
				match: [
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
					'Please add a valid URL',
				],
			},
		},
		team: [
			{
				name: {
					type: String,
					required: [true, 'A team member name is required'],
				},
				position: {
					type: String,
					required: [true, 'A team member position is required'],
				},
				avatar: {
					type: String,
					required: [true, 'A team member avatar is required'],
				},
			},
		],
		hiring: {
			type: Boolean,
			required: [true, 'A company hiring status is required'],
		},
		value: {
			type: String,
		},
		mission: {
			type: String,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Company', CompanySchema);
