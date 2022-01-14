import mongoose from 'mongoose';

const PauseRequestSchema = mongoose.Schema(
	{   
        fullName: String,
        takeBreak: {
            type: Boolean, 
            default: false
        },
        privacyIssues: {
            type: Boolean, 
            default: false
        },
        connectionIssues: {
            type: Boolean, 
            default: false
        },
        busyDistracting: {
            type: Boolean, 
            default: false
        },
        otherReasons: String
	},
	{ timestamps: true }
);

export default mongoose.model('PauseAccountRequest', PauseRequestSchema);
