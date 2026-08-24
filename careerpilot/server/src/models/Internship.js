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
  },
  { timestamps: true }
);

internshipSchema.index({ title: 1, company: 1, applyLink: 1 }, { unique: true });

export const Internship = mongoose.model('Internship', internshipSchema);
export default Internship;
