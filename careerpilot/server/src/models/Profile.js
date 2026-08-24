import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    education: { type: [String], default: [] },
    preferences: {
      roles: { type: [String], default: [] },
      location: { type: String, default: '' },
      workMode: { type: String, default: '' },
      stipendRange: { type: String, default: '' },
    },
    resumeText: { type: String, default: '' },
    embedding: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
