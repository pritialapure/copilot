export function buildAnalytics({ applications, matches, internships, profile }) {
  const totalApplications = applications.length;
  const interviews = applications.filter((a) => ["INTERVIEW", "OFFER"].includes(a.status)).length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const matchByInternship = new Map(matches.map((match) => [match.internshipId, match]));
  const appliedMatches = applications.map((a) => matchByInternship.get(a.internshipId)).filter(Boolean);
  const matchScoreEffectiveness = appliedMatches.length ? Math.round(appliedMatches.reduce((sum, m) => sum + m.score, 0) / appliedMatches.length) : 0;
  const counts = new Map();
  applications.filter((a) => ["INTERVIEW", "OFFER"].includes(a.status)).forEach((a) => {
    const match = matchByInternship.get(a.internshipId);
    match?.matchedSkills?.forEach((skill) => counts.set(skill, (counts.get(skill) || 0) + 1));
  });
  const topPerformingSkills = [...counts.entries()].sort((a,b) => b[1]-a[1]).slice(0, 5).map(([skill,count]) => ({ skill, count }));
  const recommendationNote = !totalApplications ? "Save promising internships to begin tracking your outcomes." : offers ? "Your pipeline is producing offers—repeat the skills and role patterns that are working." : interviews ? "You are converting to interviews. Keep prioritizing roles with your strongest matched skills." : "Build momentum by tailoring your resume and applying to your highest-match opportunities.";
  return {
    totalApplications, interviewRate: totalApplications ? Math.round((interviews / totalApplications) * 100) : 0,
    offerRate: totalApplications ? Math.round((offers / totalApplications) * 100) : 0,
    matchScoreEffectiveness, topPerformingSkills, recommendationNote
  };
}
