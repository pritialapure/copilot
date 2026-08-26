import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    status: {
      type: String,
      enum: ['SAVED', 'PREPARING', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'],
      default: 'SAVED',
    },
    appliedAt: { type: Date },
    nextActionDate: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
export const APPLICATION_STATUSES = ['SAVED', 'PREPARING', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
export default Application;
