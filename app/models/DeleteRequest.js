import mongoose from 'mongoose';

const DeleteRequestSchema = mongoose.Schema(
	{   
        fullName: String,
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a valid email',
			],
		},
        notUseful: {
            type: Boolean, 
            default: false
        },
        dontUnderstand: {
            type: Boolean, 
            default: false
        },
        safetyIssues: {
            type: Boolean, 
            default: false
        },
        privacyIssues: {
            type: Boolean, 
            default: false
        },
        otherReasons: String
	},
	{ timestamps: true }
);

export default mongoose.model('DeleteRequest', DeleteRequestSchema);
