const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const rateLimit = require("express-rate-limit");

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many resume requests. Please try again in a minute.",
  },
});

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();

app.use(
  cors({
    origin: [
      "https://ai-resume-builder1-1.onrender.com",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
    ],
    methods: ["GET", "POST"],
  })
);

app.use(
  express.json({
    limit: "100kb",
  })
);

const PORT = process.env.PORT || 3000;


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "AI Resume Builder Backend Running"
  });
});


// ==========================================
// GENERATE RESUME
// ==========================================

app.post(
  "/generate-resume",
  generateLimiter,
  async (req, res) => {

  try {

    const {
      resumeType,
      personalInfo,
      education,
      experience,
      projects,
      skills,
      extracurricular
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (!personalInfo || !education || !skills) {

      return res.status(400).json({
        error:
          "Personal information, education and skills are required."
      });

    }


    // ========================================
    // CREATE PROMPT
    // ========================================

    const prompt = `
You are an expert ATS resume writer and technical recruiter.

Create a professional, concise, ATS-friendly resume
targeted to the following role:

${resumeType}

USER INFORMATION

Personal Information:
${personalInfo}

Education:
${education}

Work Experience:
${experience || "No professional work experience provided"}

Projects:
${projects || "No projects provided"}

Technical Skills:
${skills}

Leadership / Extracurricular:
${extracurricular || "None provided"}

IMPORTANT RULES:

Use ONLY factual information supplied by the user.

Never invent:
- companies
- degrees
- universities
- dates
- certifications
- technologies
- achievements
- percentages
- work experience
- numerical results

Improve grammar and professional wording.

Optimize the resume for the target role.

Do not create fake employment for freshers.

Emphasize projects, education and skills for freshers.

Keep the resume concise enough to reasonably fit
on one A4 page.

Do not include empty sections.

Use relevant ATS keywords only when supported by
the information supplied by the user.

Return ONLY resume HTML.

Do not return Markdown.

Do not include:
<html>
<head>
<body>
<style>
<script>

Use these CSS classes:

resume-header
resume-name
resume-contact
resume-section
resume-section-title
resume-item
resume-item-header
resume-item-subtitle
resume-item-location
resume-list
skills-section
skill-item
skill-label

Generate the final resume HTML.
`;


    // ========================================
    // CALL GEMINI
    // ========================================

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );


    const data = await geminiResponse.json();


    // ========================================
    // GEMINI ERROR
    // ========================================

    if (!geminiResponse.ok) {

      console.error("Gemini error:", data);

      return res.status(geminiResponse.status).json({
        error:
          data.error?.message ||
          "Gemini API request failed."
      });

    }


    // ========================================
    // EXTRACT RESULT
    // ========================================

    let resumeHTML =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;


    if (!resumeHTML) {

      return res.status(500).json({
        error: "Gemini returned an empty response."
      });

    }


    // Remove possible Markdown fences

    resumeHTML = resumeHTML
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .trim();


    // ========================================
    // SEND RESULT TO FRONTEND
    // ========================================

    res.json({
      resumeHTML
    });


  } catch (error) {

    console.error(
      "Generate Resume Error:",
      error
    );

    res.status(500).json({
      error: "Internal server error."
    });

  }

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

  console.log(
    `AI Resume Builder backend running on port ${PORT}`
  );

});