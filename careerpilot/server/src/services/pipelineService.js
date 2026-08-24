import { getOne, getAll, upsert, deleteWhere } from './repository.js';
import { discoverInternships } from '../agents/discoveryAgent.js';
import { scoreInternship } from '../agents/matchingAgent.js';

export async function syncInternshipsForProfile(profile) {
  try {
    const discovered = await discoverInternships(profile);
    const synced = [];

    for (const internship of discovered) {
      const upserted = await upsert(
        'internships',
        { title: internship.title, company: internship.company, applyLink: internship.applyLink },
        internship,
        internship
      );
      synced.push(upserted);
    }

    return { count: synced.length, internships: synced };
  } catch (err) {
    console.error('❌ syncInternshipsForProfile error:', err.message);
    throw err;
  }
}

export async function regenerateMatches(userId, profile) {
  try {
    if (!profile.resumeText) {
      throw new Error('Profile must have resume text');
    }

    const internships = await getAll('internships');
    const matches = [];

    for (const internship of internships) {
      const scoreResult = await scoreInternship(profile, internship);
      const match = await upsert(
        'matches',
        { userId, internshipId: internship._id },
        {
          userId,
          internshipId: internship._id,
          ...scoreResult,
        },
        scoreResult
      );
      matches.push(match);
    }

    return matches.sort((a, b) => b.score - a.score);
  } catch (err) {
    console.error('❌ regenerateMatches error:', err.message);
    throw err;
  }
}

export default {
  syncInternshipsForProfile,
  regenerateMatches,
};
