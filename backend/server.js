require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const app = express();

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
  console.log("🔥 Analyze route hit");

  try {
    const { resumeText } = req.body;

    console.log("Resume length:", resumeText?.length);

    const prompt = `
Analyze this resume and return ONLY valid JSON.

{
  "atsScore": number,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": [],
  "recommendedRoles": []
}

Resume:
${resumeText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("🔥 FULL GEMINI RESPONSE:");
    console.log(response);

    let resultText = "";

    if (typeof response.text === "function") {
      resultText = response.text();
    } else {
      resultText = response.text;
    }

    console.log("🔥 RESULT TEXT:");
    console.log(resultText);

    res.json({
      success: true,
      result: resultText,
    });
  } catch (error) {
    console.error("🔥 GEMINI ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});