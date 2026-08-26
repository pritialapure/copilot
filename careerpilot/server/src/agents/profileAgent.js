import pdfParse from 'pdf-parse';
import { extractSkills, summarizeText, sectionLines } from '../utils/text.js';
import { generateLocalText, generateEmbedding } from '../services/ollamaService.js';

export async function parseResume(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    const resumeText = data.text.trim();

    if (!resumeText || resumeText.length < 30) {
      throw new Error('Resume text too short or empty');
    }

    // Extract profile data
    const skills = extractSkills(resumeText);
    const projects = sectionLines(resumeText, ['project', 'built', 'developed']);
    const experience = sectionLines(resumeText, ['experience', 'intern', 'worked']);
    const education = sectionLines(resumeText, ['education', 'university', 'college', 'school', 'degree']);

    // Generate summary
    let summary = summarizeText(resumeText, 220);
    if (!summary) {
      const aiSummary = await generateLocalText(`Summarize this resume in 1-2 sentences: ${resumeText.substring(0, 500)}`);
      summary = aiSummary || 'Professional resume';
    }

    // Generate embedding
    const embedding = await generateEmbedding(resumeText);

    return {
      resumeText,
      skills,
      projects,
      experience,
      education,
      summary,
      embedding,
    };
  } catch (err) {
    console.error('❌ Resume parsing error:', err.message);
    throw err;
  }
}

export default { parseResume };
