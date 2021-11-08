import mongoose from 'mongoose';

const CompanySchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A company name is required'],
		},
		industry: {
			type: String,
			required: [true, 'A company industry is required'],
		},
		logo: {
			type: String,
			required: [true, 'A company logo is required'],
		},
		description: {
			type: String,
			required: [true, 'A company description is required'],
		},
		headquarters: {
			type: String,
			required: [true, 'A company headquarters is required'],
		},
		size: {
			type: Number,
			min: [1, 'Company size cannot be less than one'],
		},
		address: {
			type: String,
			required: [true, 'A company address is required'],
		},
		phone: {
			type: String,
			required: [true, 'A company phone is required'],
		},
		founded: {
			type: String,
			required: [true, 'A company found date is required'],
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
		socialMedia: {
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
