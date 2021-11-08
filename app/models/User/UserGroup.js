import mongoose from 'mongoose';

const UserGroupSchema = mongoose.Schema(
	{
		avatar: {
			type: String,
			required: [true, 'Please add an avatar'],
		},
		name: {
			type: String,
			required: [true, 'Please add a group'],
		},
		location: {
			type: String,
			required: [true, 'Please add a location'],
		},
		sector: {
			type: String,
			required: [true, 'Please add a sector'],
		},
		members: {
			type: Number,
			min: [1, 'A group must have at least a member'],
		},
	},
	{ timestamps: true }
);

export default mongoose.model('UserGroup', UserGroupSchema);
