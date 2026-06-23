require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY,
});
console.log("KEY:", process.env.GEMINI_API_KEY?.slice(0, 10));
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "uploads/");
},
filename: function (req, file, cb) {
cb(null, Date.now() + "-" + file.originalname);
},
});

const upload = multer({ storage });

app.get("/", (req, res) => {
res.send("Career OS Backend Running 🚀");
});

app.post("/upload-resume", upload.single("resume"), (req, res) => {
res.json({
success: true,
file: req.file,
message: "Resume uploaded successfully!",
});
});

app.post("/analyze-resume", async (req, res) => {
  try {
    console.log("🔥 Analyze route hit");

    const { resumeText, targetRole } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        error: "Resume text is required",
      });
    }
console.log("Resume Length:", resumeText.length);
   const prompt = `
Analyze the following resume for the target role: ${targetRole}

Resume:
${resumeText.substring(0, 2000)}

========================
EVALUATION RULES
================

* Be objective, deterministic, and consistent.
* The same resume and target role should produce nearly identical results every time (maximum variance ±2).
* Do NOT generate random scores.
* Use ONLY information explicitly present in the resume.
* Do NOT assume missing skills, projects, or experience.
* First-year students should be evaluated relative to their academic level.
* Do not heavily penalize students for lack of industry experience.
* Focus on potential, projects, academics, skills, certifications, and learning activities.

========================
ATS SCORING FRAMEWORK
=====================

Resume Structure (0-20)

* Contact Information: 5
* Section Organization: 5
* ATS Friendly Layout: 5
* Readability: 5

Skills Match (0-25)

* Relevant Technical Skills: 15
* Core Programming Skills: 5
* Role Specific Skills: 5

Keyword Optimization Score (0-25)

* Relevant Keywords: 15
* Target Role Alignment: 10

Projects Score (0-15)

* Project Relevance: 10
* Project Quality & Description: 5

Education Score (0-15)

* Academic Performance: 10
* Certifications & Learning: 5

IMPORTANT:

* Do NOT generate atsScore.
* ATS Score will be calculated by backend.
* Only generate category scores.

========================
ROLE MATCH
==========

* Compare resume skills against target role requirements.
* Return a score from 0-100.
* Base score only on demonstrated skills and projects.
* Do not use randomness.

========================
SKILL GAP ANALYSIS
==================

Identify:

* Missing skills
* Knowledge gaps
* Missing tools/frameworks
* Missing certifications (if relevant)

========================
COURSE RECOMMENDATIONS
======================

Generate exactly 5 course recommendations.

Requirements:

* Use real course titles.
* Include platform names.
* Match missing skills.
* Suitable for students.
* Include popular learning resources.
* Never return an empty recommendedCourses array.

Example:

* Python for Everybody - Coursera
* Machine Learning Specialization - Coursera
* Git & GitHub Crash Course - Udemy
* AWS Cloud Practitioner Essentials - AWS Skill Builder
* SQL for Data Science - Coursera

========================
LEARNING ROADMAP
================

Return exactly 5 phases.

Each phase should:

* Be practical
* Be sequential
* Focus on one learning milestone

Example:

Phase 1 → Python Fundamentals
Phase 2 → Data Analysis
Phase 3 → Machine Learning
Phase 4 → Projects
Phase 5 → Deployment & Portfolio

========================
CATEGORY ANALYSIS
=================

Generate scores (0-100):

* ATS Compatibility
* Content Quality
* Formatting
* Keyword Optimization

For each category:

* Provide exactly 3 actionable improvement tips.

========================
CONSISTENCY RULES
=================

* Never return empty arrays unless absolutely necessary.
* missingSkills must contain at least 3 items if skill gaps exist.
* learningRoadmap must contain exactly 5 phases.
* strengths must contain at least 3 items.
* weaknesses must contain at least 3 items.
* recommendedRoles must contain at least 3 suitable roles.

========================
STUDENT EVALUATION RULES
========================

* If the candidate is a student or first-year student, evaluate based on:

  * Academic performance
  * Learning activities
  * Projects
  * Technical skills
  * Growth potential

* Do NOT heavily penalize students for:

  * Lack of internships
  * Lack of professional experience
  * Lack of industry projects

========================
ROLE MATCH SCORING GUIDE
========================

0-20 = Very weak alignment
21-40 = Beginner alignment
41-60 = Partial alignment
61-80 = Strong alignment
81-100 = Excellent alignment

========================
OUTPUT FORMAT
=============

Return ONLY valid JSON.

{
"resumeStructure": 0,
"skillsMatch": 0,
"keywordOptimizationScore": 0,
"projectsScore": 0,
"educationScore": 0,

"roleMatch": 0,

"atsCompatibility": 0,
"contentQuality": 0,
"formatting": 0,
"keywordOptimization": 0,

"atsTips": [],
"contentTips": [],
"formattingTips": [],
"keywordTips": [],

"strengths": [],
"weaknesses": [],

"missingSkills": [],
"recommendedCourses": [],

"suggestions": [],
"recommendedRoles": [],
"areasToFocus": [],
"learningRoadmap": []
}
`;

    console.log("✅ Prompt ready");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("✅ Gemini responded");

    const text =
      result?.text ||
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    console.log(text);

    res.json({
      success: true,
      result: text,
    });

  } catch (error) {
    console.error("❌ GEMINI ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


app.post("/analyze-github", async (req, res) => {

  let githubScore = 0;

  try {
    console.log("🔥 GitHub Analyze route hit");

    const { profile, repos } = req.body;

    if (!profile || !repos) {
      return res.status(400).json({
        success: false,
        error: "Profile and repositories are required",
      });
    }

    // Repository Count
    if (profile.public_repos >= 10) githubScore += 20;
    else if (profile.public_repos >= 5) githubScore += 15;
    else githubScore += 10;

    // Followers
    if (profile.followers >= 50) githubScore += 15;
    else if (profile.followers >= 10) githubScore += 10;
    else githubScore += 5;
// Technology Diversity
const languages = [
  ...new Set(
    repos
      .map(repo => repo.language)
      .filter(Boolean)
  )
];

githubScore += Math.min(languages.length * 5, 25);

// Documentation Quality
const documentedRepos = repos.filter(
  repo => repo.description
).length;

githubScore += Math.min(documentedRepos * 2, 20);

// Activity
if (repos.length >= 5) githubScore += 20;
else githubScore += 10;

// Final Limit
githubScore = Math.min(githubScore, 100);

console.log("GitHub Score:", githubScore);
    const prompt = `
You are an expert software engineering career coach.

Analyze this GitHub profile.

Profile:
${JSON.stringify(profile)}

Repositories:
${JSON.stringify(repos.slice(0, 10))}
IMPORTANT:

- Keep all strengths under 20 words.
- Keep all weaknesses under 20 words.
- Keep recommended projects under 25 words.
- Return exactly 5 strengths.
- Return exactly 5 weaknesses.
- Return exactly 5 missing technologies.
- Return exactly 5 recommended projects.
- Use short bullet-style responses.
Use this pre-calculated GitHub Score: ${githubScore}

IMPORTANT:
- Do NOT generate githubScore.
- Only analyze strengths, weaknesses,
  missing technologies and recommended projects.
- Keep responses short.
- Return exactly 5 strengths.
- Return exactly 5 weaknesses.
- Return exactly 5 missing technologies.
- Return exactly 5 recommended projects.

Return ONLY valid JSON.

{
  "strengths": [],
  "weaknesses": [],
  "missingTechnologies": [],
  "recommendedProjects": []
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text =
      result?.text ||
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "").trim();

    console.log("Final AI Response:", text);

try {
  const parsedResult = JSON.parse(text);

  // Add backend calculated score
  parsedResult.githubScore = githubScore;

  return res.json(parsedResult);

} catch (parseError) {

  console.log("JSON Parse Error:", parseError);

  return res.json({
    githubScore: githubScore,
    strengths: [
      "Maintains public repositories",
      "Shows coding activity",
      "Uses GitHub regularly",
      "Demonstrates coding skills",
      "Active GitHub presence"
    ],
    weaknesses: [
      "Needs more advanced projects",
      "Portfolio needs diversification",
      "Needs better documentation",
      "Needs more real-world applications",
      "Needs testing and DevOps skills"
    ],
    missingTechnologies: [
      "Docker",
      "CI/CD",
      "Testing",
      "Cloud Computing",
      "System Design"
    ],
    recommendedProjects: [
      "Build a Full Stack MERN Application",
      "Create a DevOps project using Docker",
      "Develop an AI-based application",
      "Build a Cloud deployment project",
      "Create a scalable backend API"
    ]
  });
}
  } catch (error) {
    console.error("❌ GitHub Error:", error);

    res.json({
  githubScore: githubScore,
      strengths: [
        "Maintains public repositories",
        "Shows coding activity",
        "Uses GitHub regularly"
      ],
      weaknesses: [
        "Need more advanced projects",
        "Portfolio needs diversification",
        "Need more real-world applications"
      ],
      missingTechnologies: [
        "Docker",
        "CI/CD",
        "Testing"
      ],
      recommendedProjects: [
        "Build a Full Stack MERN Application",
        "Create a DevOps project using Docker",
        "Develop an AI-based application"
      ]
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
