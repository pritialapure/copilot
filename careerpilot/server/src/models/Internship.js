import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, default: '' },
    skillsRequired: { type: [String], default: [] },
    location: { type: String, default: '' },
    applyLink: { type: String, required: true },
    source: { type: String, default: 'Catalog' },
    deadline: { type: Date },
    postedDate: { type: Date, default: Date.now },
    embedding: { type: [Number], default: [] },
    // Present when this internship was ingested from an external automation
    // (e.g. a Gmail-label workflow). Used as the primary dedupe key so the same
    // email is never inserted twice, even if title/company text varies slightly.
    sourceMessageId: { type: String, default: null },
    ingestedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

internshipSchema.index({ title: 1, company: 1, applyLink: 1 }, { unique: true });
internshipSchema.index({ sourceMessageId: 1 }, { unique: true, sparse: true });

export const Internship = mongoose.model('Internship', internshipSchema);
export default Internship;
