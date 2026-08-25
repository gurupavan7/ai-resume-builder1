// ==========================================
// AI RESUME BUILDER
// ==========================================

// Get buttons
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copyBtn = document.getElementById("copyBtn");

// ==========================================
// GENERATE RESUME
// ==========================================

generateBtn.addEventListener("click", async function () {

  // Get values from form
  const resumeType = document.getElementById("resumeType").value;
  const personalInfo = document.getElementById("personalInfo").value.trim();
  const education = document.getElementById("education").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const projects = document.getElementById("projects").value.trim();
  const skills = document.getElementById("skills").value.trim();
  const extracurricular = document
    .getElementById("extracurricular")
    .value.trim();

  // ==========================================
  // VALIDATION
  // ==========================================

  if (!personalInfo) {
    alert("Please enter your personal information.");
    return;
  }

  if (!education) {
    alert("Please enter your education details.");
    return;
  }

  if (!skills) {
    alert("Please enter your technical skills.");
    return;
  }

  // ==========================================
  // CREATE AI PROMPT
  // ==========================================

  const prompt = `
You are an expert ATS resume writer and technical recruiter.

Your task is to create a professional, concise, one-page, ATS-friendly resume targeted specifically to the selected job role.

TARGET ROLE:
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

Leadership / Extracurricular Activities:
${extracurricular || "None provided"}

IMPORTANT RULES:

1. Use ONLY factual information provided by the user.
2. Never invent companies, degrees, universities, dates, certifications, technologies, achievements, percentages, job experience, links, or numerical results.
3. You may improve grammar, clarity, formatting, and professional wording.
4. Correct obvious capitalization issues such as "python" to "Python" and "javascript" to "JavaScript".
5. Optimize the resume for the target role: ${resumeType}.
6. Use relevant ATS keywords only when they are supported by the user's supplied skills, projects, education, or experience.
7. Do not claim the user knows a technology they did not provide.
8. Do not fabricate measurable achievements.
9. Keep the resume concise enough to reasonably fit on one A4 page.
10. Do not include empty sections.
11. If the user says "fresher", "none", "no experience", or equivalent for work experience, do not create fake employment. Instead emphasize projects, education, skills, and leadership.
12. Rewrite weak project descriptions into concise professional bullet points without inventing facts.
13. Prefer strong action verbs such as Developed, Built, Implemented, Designed, Created, Integrated, Analyzed, and Collaborated when supported by the supplied information.
14. Avoid first-person pronouns such as "I", "me", and "my".
15. Do not use tables, columns, graphics, icons, progress bars, photos, or decorative elements that could interfere with ATS parsing.

SECTION ORDER:

Header
Professional Summary
Technical Skills
Projects
Work Experience (only when real experience is provided)
Education
Leadership / Extracurricular Activities (when provided)

PROFESSIONAL SUMMARY:

Write a short 2-3 sentence professional summary based only on the information supplied.

For freshers, emphasize:

* target role
* relevant technical skills
* projects
* education
* willingness/readiness to apply technical knowledge

Do not use exaggerated phrases such as "world-class", "expert", "highly experienced", or "industry-leading" unless clearly supported.

PROJECTS:

For each project:

* Clearly display the project name.
* Mention technologies only if supplied by the user.
* Create 2-4 concise bullet points where enough information exists.
* Explain what was built, implemented, or achieved.
* Do not invent metrics or technologies.

TECHNICAL SKILLS:

Organize supplied skills into logical categories when possible, for example:

Programming Languages
Web Technologies
Frameworks/Libraries
AI / Machine Learning
Databases
Developer Tools

Only create categories supported by the supplied skills.

OUTPUT REQUIREMENTS:

Return ONLY the resume HTML.

Do NOT return Markdown.
Do NOT use html code fences.
Do NOT include explanations before or after the resume.
Do NOT include &lt;html&gt;, &lt;head&gt;, &lt;body&gt;, &lt;style&gt;, or &lt;script&gt; tags.

Use these existing CSS classes wherever appropriate:

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

Use simple semantic HTML elements such as:

&lt;div&gt;
  &lt;h1&gt;Resume Title&lt;/h1&gt;
  &lt;h2&gt;Section&lt;/h2&gt;
  &lt;h3&gt;Subheading&lt;/h3&gt;
  &lt;p&gt;Paragraph text&lt;/p&gt;
  &lt;ul&gt;
    &lt;li&gt;List item&lt;/li&gt;
  &lt;/ul&gt;
  &lt;a href="#"&gt;link&lt;/a&gt;
  &lt;span&gt;Label&lt;/span&gt;
&lt;/div&gt;

Generate the final ATS-friendly resume HTML now.
`;

  // ==========================================
  // SHOW LOADING
  // ==========================================

  const loading = document.getElementById("loading");

  loading.classList.add("active");
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating Resume...";

  try {

    // ==========================================
    // GEMINI API REQUEST
    // ==========================================
    const response = await fetch(
  "http://localhost:3000/generate-resume",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      resumeType,
      personalInfo,
      education,
      experience,
      projects,
      skills,
      extracurricular,
    }),
  }
);

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Failed to generate resume.");
}

const resumeHTML = data.resumeHTML;

document.getElementById("resumePreview").innerHTML = resumeHTML;

  } catch (error) {

    console.error("Resume generation error:", error);

    alert(
      "Error generating resume:\n\n" +
      error.message +
      "\n\nPlease check your API key and internet connection."
    );

  } finally {

    // ==========================================
    // STOP LOADING
    // ==========================================

    loading.classList.remove("active");

    generateBtn.disabled = false;

    generateBtn.textContent =
      "Generate Resume with AI";
  }
});


// ==========================================
// DOWNLOAD / PRINT PDF
// ==========================================

downloadBtn.addEventListener("click", function () {
  const resumeContent =
    document.getElementById("resumePreview");

  if (
    !resumeContent.innerText.trim() ||
    resumeContent.innerText.includes("Fill out the form")
  ) {
    alert("Please generate a resume first.");
    return;
  }

  window.print();
});

// ==========================================
// COPY RESUME HTML
// ==========================================

copyBtn.addEventListener("click", async function () {

  const resumePreview =
    document.getElementById("resumePreview");

  const resumeHTML =
    resumePreview.innerHTML;

  if (
    !resumePreview.innerText.trim() ||
    resumePreview.innerText.includes(
      "Fill out the form"
    )
  ) {
    alert("Please generate a resume first.");
    return;
  }

  try {

    await navigator.clipboard.writeText(
      resumeHTML
    );

    const oldText = copyBtn.textContent;

    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = oldText;
    }, 2000);

  } catch (error) {

    console.error(
      "Clipboard error:",
      error
    );

    alert(
      "Unable to copy the resume HTML."
    );
  }
});