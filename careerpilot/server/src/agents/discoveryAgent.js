import { chromium } from "playwright";
import { internshipCatalog } from "../data/internshipCatalog.js";
import { seedInternships } from "../data/seedInternships.js";
import { generateEmbedding } from "../services/ollamaService.js";
import { extractSkills, uniqueStrings } from "../utils/text.js";

const MAX_RESULTS = 10;
const LIVE_DISCOVERY_ENABLED = process.env.ENABLE_LIVE_DISCOVERY !== "false";
const LIVE_FETCH_TIMEOUT_MS = 5000;
const LIVE_TITLE_HINT = /(intern|graduate|trainee|junior|entry[\s-]?level|apprentice)/i;

function relevanceScore(profile, internship) {
  // TODO: Score the internship by skill overlap (x2), a preferred-role hit (x2), and a
  // TODO: location hit.
  return 0;
}

function normalizeInternship(raw) {
  // TODO: Normalize the posting: derive skillsRequired from the description when absent,
  // TODO: default the location, source, deadline (+14 days), and postedDate.
  return raw;
}

function dedupeByTitleCompany(internships) {
  // TODO: Drop duplicates that share a title and company.
  return internships;
}

async function fetchLiveInternships(profile) {
  // TODO: Best-effort fetch from the free Remotive API using the top preferred role or
  // TODO: skill as the search term, keep only early-career titles, strip the HTML from
  // TODO: the description, and return [] on any failure or timeout.
  return [];
}

export async function discoverInternships(profile) {
  // TODO: When the profile has skills or preferred roles, rank the curated catalog plus
  // TODO: the live postings by relevance and take the top MAX_RESULTS; otherwise fall back
  // TODO: to seedInternships. Attach an embedding to every returned internship.
  throw new Error("discoverInternships is not implemented yet");
}

export async function scrapeCompanyPage(url) {
  // TODO: Open the page with Playwright and return its body text.
  throw new Error("scrapeCompanyPage is not implemented yet");
}
