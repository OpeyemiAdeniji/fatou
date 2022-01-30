import mongoose from 'mongoose';
import { mentorshipOpportunities } from '../../helpers/constants';

const UserMentorShipAvailSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'UserProfile',
      required: true,
    },
    seeking: {
      isSeeking: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no',
      },
      opportunities: {
        required: [
          function () {
            return this.seeking.isSeeking === 'yes';
          },
          'a mentorship opportunity is required',
        ],
        type: [String],
        enum: mentorshipOpportunities,
      },
    },
    open: {
      isOpen: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no',
      },
      opportunities: {
        required: [
          function () {
            return this.open.isOpen === 'yes';
          },
          'a mentorship opportunity is required',
        ],
        type: [String],
        enum: mentorshipOpportunities,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('MentorShip', UserMentorShipAvailSchema);
