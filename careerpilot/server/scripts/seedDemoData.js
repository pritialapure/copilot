import bcryptjs from "bcryptjs";
import { connectDatabase } from "../src/config/db.js";
import { create, getOne, upsert } from "../src/services/repository.js";
import { seedInternships } from "../src/data/seedInternships.js";

await connectDatabase();
for (const internship of seedInternships) {
  await upsert("internships", { title: internship.title, company: internship.company, applyLink: internship.applyLink }, internship, internship);
}
let user = await getOne("users", { email: "demo@careerpilot.ai" });
if (!user) user = await create("users", { name: "Demo User", email: "demo@careerpilot.ai", password: await bcryptjs.hash("Demo@12345", 10) });
const profile = { userId: user._id, skills: ["javascript", "react", "node.js", "mongodb", "git", "html", "communication", "problem solving"], projects: ["Built an internship discovery dashboard with React and Node.js."], experience: ["Student developer building full-stack web applications."], education: ["Computer Science undergraduate"], preferences: { roles: ["frontend", "mern", "ai product"], location: "Remote", workMode: "remote", stipendRange: "" }, resumeText: "Demo User\nSkills: JavaScript, React, Node.js, MongoDB, Git, HTML, Communication, Problem Solving\nProjects: Built an internship discovery dashboard with React and Node.js.\nEducation: Computer Science undergraduate", embedding: [] };
await upsert("profiles", { userId: user._id }, profile, profile);
console.log("Demo data ready: demo@careerpilot.ai / Demo@12345");
