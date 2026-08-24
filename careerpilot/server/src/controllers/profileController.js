import { getOne, updateById, create, getAll, deleteWhere } from '../services/repository.js';
import { parseResume } from '../agents/profileAgent.js';
import { httpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseListInput, summarizeText } from '../utils/text.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await getOne('profiles', { userId: req.userId });
  if (!profile) {
    throw httpError(404, 'Profile not found');
  }
  res.json({ profile });
});

export const getResumeHistory = asyncHandler(async (req, res) => {
  const history = await getAll('resumeHistory', { userId: req.userId }, { createdAt: -1 });
  res.json({ history });
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw httpError(400, 'No file uploaded');
  }

  if (req.file.mimetype !== 'application/pdf') {
    throw httpError(400, 'Only PDF files are allowed');
  }

  if (req.file.size > 5 * 1024 * 1024) {
    throw httpError(400, 'File size must be less than 5MB');
  }

  // Parse resume
  let parsed;
  try {
    parsed = await parseResume(req.file.buffer);
  } catch (err) {
    throw httpError(422, 'Failed to parse resume or resume text is empty');
  }

  // Guard: if parsed text is too short, don't touch profile
  if (!parsed.resumeText || parsed.resumeText.length < 30) {
    throw httpError(422, 'Resume text too short or empty');
  }

  // Get current profile
  const profile = await getOne('profiles', { userId: req.userId });
  if (!profile) {
    throw httpError(404, 'Profile not found');
  }

  // Archive previous resume if it exists
  if (profile.resumeText) {
    const resumeVersionCount = await getAll('resumeVersions', { userId: req.userId });
    const matches = await getAll('matches', { userId: req.userId });
    const topMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(m => ({ title: m.title, company: m.company, score: m.score }));
    const highMatchCount = matches.filter(m => m.score >= 80).length;

    const versionCount = await getAll('resumeHistory', { userId: req.userId });
    const label = `Resume #${versionCount.length + 1}`;

    await create('resumeHistory', {
      userId: req.userId,
      label,
      skills: profile.skills,
      summary: summarizeText(profile.resumeText, 200),
      topMatches,
      matchCount: matches.length,
      highMatchCount,
      resumeVersionCount: resumeVersionCount.length,
      supersededAt: new Date(),
    });
  }

  // Update profile with new resume data
  const updatedProfile = await updateById('profiles', profile._id, {
    skills: parsed.skills,
    projects: parsed.projects,
    experience: parsed.experience,
    education: parsed.education,
    resumeText: parsed.resumeText,
    embedding: parsed.embedding,
  });

  // Clear matches and resume versions
  await deleteWhere('matches', { userId: req.userId });
  await deleteWhere('resumeVersions', { userId: req.userId });

  res.json({
    profile: updatedProfile,
    summary: parsed.summary,
    pipelineReset: true,
  });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const { roles, location, workMode, stipendRange } = req.body;

  const profile = await getOne('profiles', { userId: req.userId });
  if (!profile) {
    throw httpError(404, 'Profile not found');
  }

  const preferences = {
    roles: roles ? parseListInput(roles) : profile.preferences.roles,
    location: location || profile.preferences.location,
    workMode: workMode || profile.preferences.workMode,
    stipendRange: stipendRange || profile.preferences.stipendRange,
  };

  const updated = await updateById('profiles', profile._id, { preferences });
  res.json({ profile: updated });
});

export default {
  getProfile,
  getResumeHistory,
  uploadResume,
  updatePreferences,
};
