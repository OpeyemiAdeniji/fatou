import mongoose from 'mongoose';

const EventSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'UserProfile',
		},
		poster: {
			name: {
				type: String,
				required: [true, 'An event poster name is required'],
			},
			email: {
				type: String,
				required: [true, 'An event poster email is required'],
				match: [
					/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
					'Please add a valid email',
				],
			},
		},
		name: {
			type: String,
			required: [true, 'An event name is required'],
		},
		url: {
			type: String,
			required: [true, 'An event url is required'],
			match: [
				/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
				'Please add a valid URL',
			],
		},
		date: {
			start: {
				type: Date,
				required: [true, 'An event start date is required'],
			},
			end: {
				type: Date,
				required: [true, 'An event end date is required'],
			},
		},
		time: {
			type: String,
		},
		admission: {
			type: String,
			enum: ['Free', 'Paid'],
		},
		logo: {
			type: String,
		},
		description: {
			type: String,
			required: [true, 'An event description is required'],
		},
		approved: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Event', EventSchema);
