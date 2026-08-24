export async function buildSkillGapReport(match) {
  if (!match.missingSkills || match.missingSkills.length === 0) {
    return {
      internshipId: match.internshipId,
      missingSkills: [],
      priorities: [],
    };
  }

  const priorities = match.missingSkills.map((skill, index) => {
    const priority = index < 2 ? 'High' : 'Medium';
    const suggestedActions = {
      javascript: 'Complete freeCodeCamp JavaScript course',
      react: 'Build 2-3 projects with React hooks',
      'node.js': 'Create a REST API with Express',
      mongodb: 'Design and implement a MongoDB schema',
      python: 'Solve LeetCode problems in Python',
      'express': 'Build middleware and routing patterns',
      'rest api': 'Design RESTful endpoints following best practices',
      docker: 'Containerize an existing application',
      git: 'Practice branching, merging, and rebasing',
      sql: 'Master SQL joins and query optimization',
    };

    const miniProjects = {
      javascript: 'Build a todo app with vanilla JS',
      react: 'Create a weather app with API integration',
      'node.js': 'Build a file uploader service',
      mongodb: 'Create a blog backend with MongoDB',
      python: 'Write a web scraper',
      docker: 'Containerize a Node.js API',
      git: 'Contribute to an open-source project',
      sql: 'Design a relational database for a startup idea',
    };

    return {
      skill,
      priority,
      suggestedAction: suggestedActions[skill.toLowerCase()] || `Learn ${skill} through online courses and practice`,
      miniProject: miniProjects[skill.toLowerCase()] || `Build a project using ${skill}`,
    };
  });

  return {
    internshipId: match.internshipId,
    missingSkills: match.missingSkills,
    priorities,
  };
}

export default { buildSkillGapReport };
