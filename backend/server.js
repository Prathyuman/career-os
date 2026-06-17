require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const app = express();
console.log("API KEY:", process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY,
});

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

    const prompt = `
Analyze the following resume for the target role: ${targetRole}

Resume:
${resumeText}

Return ONLY valid JSON in this format:

{
  "atsScore": 0,
  "roleMatch": 0,
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
      model: "gemini-2.0-flash",
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
