import mongoose from 'mongoose';

const resumeHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, default: '' },
    skills: { type: [String], default: [] },
    summary: { type: String, default: '' },
    topMatches: [
      {
        title: String,
        company: String,
        score: Number,
      },
    ],
    matchCount: { type: Number, default: 0 },
    highMatchCount: { type: Number, default: 0 },
    resumeVersionCount: { type: Number, default: 0 },
    supersededAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ResumeHistory = mongoose.model('ResumeHistory', resumeHistorySchema);
export default ResumeHistory;
