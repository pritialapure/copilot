import { upsert, getAll } from '../services/repository.js';
import { extractSkills } from '../utils/text.js';
import { httpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Normalizes one item from your automation workflow into the shape stored in
// the shared `internships` collection. Everything else in the app (Explorer,
// Matching, Skill-Gap, Tailoring) already treats internships as source-agnostic,
// so nothing downstream needs to change to support this new source.
function normalizeIngestItem(raw) {
  const title = String(raw.title || '').trim();
  const company = String(raw.company || '').trim();
  const applyLink = String(raw.applyLink || raw.applicationLink || raw.link || '').trim();

  if (!title || !company || !applyLink) {
    throw httpError(400, 'Each internship needs at least title, company, and applyLink');
  }

  const description = String(raw.description || raw.summary || '').trim();
  const location = String(raw.location || 'Not specified').trim();
  const skillsRequired = Array.isArray(raw.skillsRequired) && raw.skillsRequired.length
    ? raw.skillsRequired.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
    : extractSkills(`${title} ${description}`);

  // Accept a few common date shapes from automation tools (ISO strings, or a
  // human "Last date to apply: DD/MM/YYYY" style string already parsed upstream).
  const deadline = raw.deadline ? new Date(raw.deadline) : null;
  const postedDate = raw.postedDate ? new Date(raw.postedDate) : new Date();

  const sourceMessageId = raw.sourceMessageId || raw.messageId || raw.emailId || null;

  return {
    title,
    company,
    description,
    skillsRequired,
    location,
    applyLink,
    source: raw.source || 'College Placement Cell',
    deadline: isNaN(deadline?.getTime()) ? null : deadline,
    postedDate: isNaN(postedDate?.getTime()) ? new Date() : postedDate,
    embedding: [],
    sourceMessageId,
    ingestedAt: new Date(),
  };
}

export const ingestInternships = asyncHandler(async (req, res) => {
  // Accept a single opportunity object, or { internships: [...] }, or a bare array.
  const items = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body?.internships)
      ? req.body.internships
      : req.body?.title
        ? [req.body]
        : null;

  if (!items || !items.length) {
    throw httpError(400, 'Body must be an internship object, an array, or { internships: [...] }');
  }

  const results = [];
  const errors = [];

  for (const raw of items) {
    try {
      const normalized = normalizeIngestItem(raw);
      // Prefer the Gmail message ID as the dedupe key (one email = one opportunity,
      // never duplicated even if the college resends/forwards it). Fall back to the
      // existing title+company+applyLink uniqueness when no message id is supplied.
      const filter = normalized.sourceMessageId
        ? { sourceMessageId: normalized.sourceMessageId }
        : { title: normalized.title, company: normalized.company, applyLink: normalized.applyLink };

      const saved = await upsert('internships', filter, normalized, normalized);
      results.push(saved);
    } catch (err) {
      errors.push({ item: raw?.title || raw?.company || 'unknown', message: err.message });
    }
  }

  res.status(201).json({
    count: results.length,
    internships: results,
    errors: errors.length ? errors : undefined,
  });
});

export const listIngestedInternships = asyncHandler(async (req, res) => {
  const internships = await getAll('internships', { source: 'College Placement Cell' }, { postedDate: -1 });
  res.json({ internships });
});

export default { ingestInternships, listIngestedInternships };
