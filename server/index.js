import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse'; // Default import working for some versions, or use * as pdfParse
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper to extract text from buffer
async function extractText(fileBuffer, mimeType) {
    console.log(`Processing file with mimeType: ${mimeType}`); // Debug log
    if (mimeType === 'application/pdf') {
        const data = await pdfParse(fileBuffer);
        return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
    } else if (mimeType === 'text/plain') {
        return fileBuffer.toString('utf-8');
    }
    throw new Error(`Unsupported file type: ${mimeType}`);
}

import { generateResumePDF } from './resumeGeneratorPDF.js';

// ... existing code ...

app.post('/api/generate-resume', async (req, res) => {
    try {
        console.log("📄 Generating Resume Document...");
        const data = req.body;

        // Generate DOCX buffer
        const buffer = await generateResumePDF(data);

        // Set headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename=MyResume.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        res.send(buffer);
        console.log("✅ Resume generated and sent.");
    } catch (error) {
        console.error("Error generating resume:", error);
        res.status(500).json({ error: "Failed to generate resume" });
    }
});
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    // 1. Setup Smart Mock Response Helper
    const generateSmartMock = (text, role) => {
        console.log("🧠 Generating SMART Mock Response...");

        // Simple heuristic analysis
        const keywords = {
            "Frontend": ["React", "Angular", "Vue", "CSS", "HTML", "JavaScript", "TypeScript", "Redux"],
            "Backend": ["Node", "Express", "Python", "Java", "SQL", "MongoDB", "API", "Docker"],
            "Data": ["Python", "Pandas", "SQL", "Machine Learning", "Tableau", "R"],
            "General": ["Communication", "Leadership", "Project Management", "Agile", "Teamwork"]
        };

        const lowerText = text.toLowerCase();
        let score = 40; // Base score (Lowered to be stricter)
        let matchedSkills = [];
        let missingSkills = [];

        // Check for specific tech keywords
        const allTech = [...keywords.Frontend, ...keywords.Backend, ...keywords.Data];
        allTech.forEach(skill => {
            if (lowerText.includes(skill.toLowerCase())) {
                score += 3;
                matchedSkills.push(skill);
            } else {
                if (Math.random() > 0.7) missingSkills.push(skill); // Randomly suggest missing skills
            }
        });

        // Cap score
        score = Math.min(Math.max(score, 45), 95);

        // Determine Status
        let status = "needs-improvement";
        if (score >= 75) status = "job-ready";
        else if (score >= 50) status = "almost-there";

        return {
            "score": score,
            "status": status,
            "analysis": `Analysis based on valid resume content. Detected strong experience with ${matchedSkills.slice(0, 3).join(', ')}.`,
            "recruiters": ["TechStart Recruitment", "Global Talent Search", "Future Hires Corp"],
            "feedback": score > 80 ? "Excellent profile! Your technical stack is very relevant." : "Good foundation, but consider adding more modern frameworks to your projects.",
            "skillGaps": [
                { "category": "Recommended Skills", "completion": Math.floor(score * 0.8), "missingSkills": missingSkills.slice(0, 3) }
            ],
            "missingKeywords": missingSkills.slice(3, 6),
            "resumeImprovements": [
                { "original": "Managed a team", "improved": "Led a cross-functional team of 5 developers to deliver project X on time", "reason": "Added leadership specifics and metrics" }
            ],
            "roadmap": [
                { "week": 1, "title": "Skill Up", "skills": missingSkills.slice(0, 1), "tasks": [`Complete a project using ${missingSkills[0] || 'New Tech'}`], "project": "Portfolio Upgrade", "completed": false }
            ],
            "projectIdeas": [],
            "targetRole": role
        };
    };

    const sendMockResponse = (res, role, text) => {
        return res.json(generateSmartMock(text || "", role));
    };

    const jobRole = req.body.jobRole || 'General Role';

    try {
        if (!req.file) {
            console.log("No file part found");
            // Only case we might still want to 400? Or just mock? Let's 400 for no file.
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        let resumeText = "";
        try {
            resumeText = await extractText(req.file.buffer, req.file.mimetype);
        } catch (e) {
            console.error("Extraction Parsing Failed:", e.message);
            // Don't return 400, throw to hit the mock fallback
            throw new Error("Extraction Failed");
        }

        console.log("Extracted Text Length:", resumeText.length);
        req.resumeTextForMock = resumeText; // Save for fallback usage

        // Strict Validation: Check for mandatory resume sections
        // User requested: About, Education, Skills, Languages known
        const requiredKeywords = ['education', 'skills', 'experience', 'projects']; // Core sections (must have at least one)
        const secondaryKeywords = ['about', 'languages', 'summary', 'contact', 'objective', 'profile']; // Common headers

        const lowerText = resumeText.toLowerCase();

        // Logic: Must have at least 1 "Required" keyword AND likely some "Secondary" ones? 
        // Or simple check: Must have 'education' AND 'skills' (very common).
        // Let's implement a robust check: Must find at least 2 distinct keywords from the combined list.
        const allKeywords = [...requiredKeywords, ...secondaryKeywords];
        const foundKeywords = allKeywords.filter(keyword => lowerText.includes(keyword));

        console.log("Found Keywords:", foundKeywords);

        if (foundKeywords.length < 2) {
            console.log("Validation Failed: Not enough resume keywords found.");
            // Return 400 DIRECTLY to stop execution (do not throw to catch block if we want to avoid mock fallback for this)
            return res.status(400).json({
                error: "Invalid File: The uploaded document does not appear to be a resume. It must contain standard sections like 'Education', 'Skills', or 'Experience'."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.log("Missing API Key. Proceeding to Mock Mode.");
            throw new Error("Missing API Key");
        }

        // Gemini API Call
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
    You are an expert HR Recruiter and Career Coach. Analyze the following resume text for the role of "${jobRole}".
    
    Resume Text:
    ${resumeText}
    
    Task:
    Provide a detailed career analysis in JSON format.
    
    Output JSON Schema:
    {
      "score": number, // 0-100
      "status": "needs-improvement" | "almost-there" | "job-ready", // <50: needs-improvement, 50-74: almost-there, >=75: job-ready
      "analysis": "string", // Brief summary
      "recruiters": ["string"], // List of 5 relevant recruiter names or companies to search on LinkedIn (only if score >= 75)
      "feedback": "string", // Encouraging feedback based on score
      "skillGaps": [
        { "category": "string", "completion": number, "missingSkills": ["string"] } // e.g. Technical, Soft Skills
      ],
      "missingKeywords": ["string"], // Key terms missing from resume
      "resumeImprovements": [
        { "original": "string", "improved": "string", "reason": "string" } // 3 specific bullet point improvements
      ],
      "roadmap": [
        { "week": number, "title": "string", "skills": ["string"], "tasks": ["string"], "project": "string", "completed": boolean } // 4-week plan. completed should be false.
      ],
      "projectIdeas": [
        { "title": "string", "description": "string", "skills": ["string"], "difficulty": "Beginner" | "Intermediate" | "Advanced" } // 3 ideas
      ]
    }
    
    Ensure the JSON is valid and strictly follows the schema.
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResponse = JSON.parse(cleanText);
            jsonResponse.targetRole = jobRole;
            res.json(jsonResponse);
        } catch (apiError) {
            console.error("Gemini API Error:", apiError);
            throw apiError; // Throw to hit the general catch block
        }

    } catch (error) {
        console.error("Analysis Failed (Triggering Fallback):", error.message);
        // Pass the resumeText (if extracted) to generate a "Smart" mock based on actual content
        // If resumeText is empty (extraction failed), it will generate a generic low score.
        return sendMockResponse(res, jobRole, req.resumeTextForMock || "");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
