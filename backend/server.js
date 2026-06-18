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
app.listen(5000, () => {
console.log("Server running on port 5000");
});
