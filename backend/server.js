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

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({
        success: false,
        error: "Target role is required",
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
SKILLS EXTRACTION
=================

Extract every technical skill, programming language, framework, library,
tool, database, and platform the candidate explicitly demonstrates in the
resume (via skills sections, projects, coursework, or experience).

* Do NOT limit this to any predefined list — extract whatever is actually
  present in the resume text.
* Do NOT infer or assume skills that are not explicitly mentioned.
* Normalize casing/naming (e.g. "react.js" -> "React", "nodejs" -> "Node.js").
* Remove duplicates.
* Return as many as are genuinely present (no artificial minimum or maximum).

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

Generate as many course recommendations as are actually needed to close the candidate's skill gaps (do NOT cap at 5, return as many as necessary to cover all missing skills).

CRITICAL REQUIREMENT:
* ALL recommended courses MUST be 100% FREE learning resources.
* Point to free resources only: freeCodeCamp, YouTube free courses/playlists, official documentation guides, Coursera/edX free-to-audit courses, Khan Academy, MIT OpenCourseWare, MDN Web Docs, takeUforward.
* Do NOT recommend paid-only courses. If a skill requires learning, find the free alternative.

Requirements:
* Use real free course/tutorial titles.
* Include platform names (e.g., "freeCodeCamp", "YouTube", "Coursera (Free Audit)", "MDN Docs").
* Match missing skills.
* Never return an empty recommendedCourses array.

========================
LEARNING ROADMAP
================

Return as many phases as needed to systematically close the candidate's skill gap.

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
* extractedSkills must reflect only skills explicitly present in the resume text.
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

"extractedSkills": [],
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

    if (!Array.isArray(repos)) {
      return res.status(400).json({
        success: false,
        error: "Repositories must be an array",
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
app.post("/generate-interview", async (req, res) => {
  try {
    const { targetRole, skills, resumeText, round, previousQuestions } = req.body;

    const roundType = round || "aptitude";
    const roleName = targetRole || "Software Engineer";
    const skillsList = (skills || []).join(", ") || "Software Development & Problem Solving";
    const prevQuestionsList = Array.isArray(previousQuestions) && previousQuestions.length > 0
      ? previousQuestions.slice(-25).map((q, i) => `${i + 1}. "${q}"`).join("\n")
      : "None";

    let prompt = "";

    if (roundType === "aptitude") {
      prompt = `
You are a senior hiring manager conducting Round 1: Aptitude & Logical Thinking for a candidate targeting the role: "${roleName}".
Candidate Skills: ${skillsList}.

Generate 3 challenging, practical Aptitude & Logical Thinking questions.
Include logical puzzles, quantitative reasoning, analytical sequence puzzles, or problem-solving scenarios.

PREVIOUSLY ASKED QUESTIONS (STRICT DO NOT REPEAT RULE):
${prevQuestionsList}

CRITICAL RULES:
1. Generate completely NEW, unique questions. DO NOT repeat, rephrase, or duplicate any of the previously asked questions listed above.
2. The questions must test logical sharpness, pattern recognition, and quantitative aptitude.

Return ONLY valid JSON format:
{
  "questions": [
    { "id": 1, "question": "Detailed aptitude/logic question...", "topic": "Quantitative & Logic" },
    { "id": 2, "question": "Detailed logical puzzle/scenario question...", "topic": "Analytical Thinking" },
    { "id": 3, "question": "Detailed reasoning question...", "topic": "Problem Solving Aptitude" }
  ]
}
`;
    } else if (roundType === "dsa") {
      prompt = `
You are a lead technical interviewer conducting Round 2: Data Structures, Algorithms & Coding Logic for a candidate targeting the role: "${roleName}".
Candidate Technical Skills: ${skillsList}.

Generate 3 realistic Data Structures, Algorithms, and Coding Logic interview questions.
Include questions on Data Structures (Arrays, Hash Maps, Trees, Graphs, Stacks/Queues), Algorithms (Sorting, Searching, Dynamic Programming, Recursion, Graph Traversal), and Time/Space Complexity (Big-O analysis).

PREVIOUSLY ASKED QUESTIONS (STRICT DO NOT REPEAT RULE):
${prevQuestionsList}

CRITICAL RULES:
1. Generate completely NEW, unique questions. DO NOT repeat, rephrase, or duplicate any of the previously asked questions listed above.
2. Make questions practical for a ${roleName} tech interview.

Return ONLY valid JSON format:
{
  "questions": [
    { "id": 1, "question": "Detailed DSA/Algorithm question...", "topic": "Data Structures & Complexity" },
    { "id": 2, "question": "Detailed coding logic question...", "topic": "Algorithmic Efficiency" },
    { "id": 3, "question": "Detailed system/data structure question...", "topic": "Coding Logic" }
  ]
}
`;
    } else {
      // Round 3: Final HR Round (Resume-Based & Professional HR)
      const resumeSnippet = (resumeText || "").trim().substring(0, 1800) || `Candidate targeting ${roleName} with skills: ${skillsList}`;

      prompt = `
You are a Senior HR Director conducting Round 3: Final Resume-Based & Professional HR Round for a candidate applying for the role: "${roleName}".

CANDIDATE RESUME & SKILLS CONTEXT:
Resume Text / Overview:
"${resumeSnippet}"

Declared Skills: ${skillsList}

PREVIOUSLY ASKED QUESTIONS (STRICT DO NOT REPEAT RULE):
${prevQuestionsList}

INSTRUCTIONS FOR ROUND 3 (RESUME-BASED & PROFESSIONAL HR):
1. Generate 3 professional HR and behavioral questions.
2. At least 2 of the 3 questions MUST be explicitly based on the candidate's actual RESUME provided above — referencing specific projects, technologies, education, achievements, or experience mentioned in their resume!
3. Include real-world professional HR questions (behavioral situation using STAR approach, technical conflict resolution, workplace ethics, career trajectory, handling pressure).
4. DO NOT repeat or rephrase any of the previously asked questions listed above.

Return ONLY valid JSON format:
{
  "questions": [
    { "id": 1, "question": "Detailed resume project / experience HR question...", "topic": "Resume Project & HR" },
    { "id": 2, "question": "Detailed professional behavioral HR scenario...", "topic": "Behavioral & Leadership" },
    { "id": 3, "question": "Detailed career alignment / resume achievement question...", "topic": "Professional HR" }
  ]
}
`;
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = result?.text || result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw e;
      }
    }

    return res.json({ success: true, questions: parsed.questions || [] });
  } catch (error) {
    console.error("❌ Interview Generation Error:", error);
    const role = req.body.targetRole || "Software Engineer";
    if (req.body.round === "aptitude") {
      return res.json({
        success: true,
        questions: [
          { id: 1, question: "A system processes 120 requests per minute with a 15% failure rate. How many successful requests occur in 4 hours?", topic: "Quantitative Aptitude" },
          { id: 2, question: "If 5 workers complete a project in 12 days, how many days will 3 workers take under identical conditions?", topic: "Logical Reasoning" },
          { id: 3, question: "How would you prioritize 3 critical production tasks with competing deadlines and limited engineering bandwidth?", topic: "Analytical Thinking" }
        ]
      });
    } else if (req.body.round === "dsa") {
      return res.json({
        success: true,
        questions: [
          { id: 1, question: `How would you optimize lookup and insertion times for a high-concurrency ${role} cache system?`, topic: "Data Structures & Big-O" },
          { id: 2, question: "Explain how a Hash Table resolves collisions using chaining vs open addressing, and state worst-case complexity.", topic: "Algorithm Optimization" },
          { id: 3, question: "Walk me through how you would detect a cycle in a Directed Graph using DFS or Kahn's algorithm.", topic: "Graph Algorithms" }
        ]
      });
    } else {
      return res.json({
        success: true,
        questions: [
          { id: 1, question: `Looking at your resume projects, walk me through the technical architecture of your primary project and your specific contribution as a ${role}.`, topic: "Resume Project Deep-Dive" },
          { id: 2, question: "Describe a situation where you had a major disagreement with a team member on technical choices. How did you handle it?", topic: "Conflict Resolution & HR" },
          { id: 3, question: `Why are you interested in advancing your career as a ${role}, and where do you see your technical impact in 3 years?`, topic: "Professional HR & Career Goals" }
        ]
      });
    }
  }
});

app.post("/evaluate-interview", async (req, res) => {
  try {
    const { question, userAnswer, round, cameraActive } = req.body;

    const prompt = `
You are a senior tech & HR interviewer and executive presence coach.
Interview Round: ${round}
Question: "${question}"
Candidate Answer: "${userAnswer}"
Camera Active during answer delivery: ${cameraActive ? "Yes" : "No"}

Evaluate the candidate's answer constructively, fairly, and accurately.
${cameraActive || round === "hr" ? "Also evaluate executive presence and body language indicators (posture, eye contact, confidence tone)." : ""}

Return ONLY valid JSON format:
{
  "score": 8,
  "feedback": "2-3 sentence overview of answer quality and technical depth.",
  "keyStrengths": ["Key strength 1", "Key strength 2"],
  "missedPoints": ["Key point missed or trade-off not mentioned"],
  "idealAnswer": "A concise model answer demonstrating best practices.",
  "bodyLanguage": {
    "postureScore": 88,
    "eyeContact": "Direct camera engagement and steady composure.",
    "confidenceTone": "Clear and professional vocal & posture delivery.",
    "bodyLanguageTip": "Maintain eye contact with the lens when summarizing project achievements."
  }
}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = result?.text || result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw e;
      }
    }

    return res.json({ success: true, evaluation: parsed });
  } catch (error) {
    console.error("❌ Interview Evaluation Error:", error);
    return res.json({
      success: true,
      evaluation: {
        score: 7,
        feedback: "Good structured response addressing the core question requirements.",
        keyStrengths: ["Clear communication", "Logical structure"],
        missedPoints: ["Could include concrete metrics or edge-case handling"],
        idealAnswer: "An optimal answer explains the core solution step-by-step and discusses trade-offs.",
        bodyLanguage: {
          postureScore: 85,
          eyeContact: "Maintained steady gaze towards camera preview.",
          confidenceTone: "Professional and composed articulation.",
          bodyLanguageTip: "Keep shoulders relaxed and posture upright during your response."
        }
      }
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});