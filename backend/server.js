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

Rules:
- ATS Score should reflect overall resume quality.
- Role Match should reflect how well the resume matches the target role.
- First-year students should not be heavily penalized for lack of industry experience.
- ATS Score should be realistic for student resumes.
- ATS Score and Role Match are different metrics.
- Evaluate ATS Compatibility, Content Quality, Formatting, and Keyword Optimization separately.
- For each category, provide a score from 0-100.
- Provide 3 actionable improvement tips for each category.
- Return ONLY valid JSON.
- Do not include markdown, explanations, or code blocks.

{
  "atsScore": 0,
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
