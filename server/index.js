import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse'; // Default import working for some versions, or use * as pdfParse
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

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

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        let resumeText;
        try {
            resumeText = await extractText(req.file.buffer, req.file.mimetype);
        } catch (e) {
            console.error(e);
            return res.status(400).json({ error: e.message });
        }

        console.log("Extracted Text Preview:", resumeText.substring(0, 100)); // Debug log

        // Basic validation: Check for common resume keywords
        const keywords = ['resume', 'experience', 'skills', 'education', 'contact', 'summary', 'projects', 'work history'];
        const lowerText = resumeText.toLowerCase();
        const hasKeywords = keywords.some(keyword => lowerText.includes(keyword));

        console.log("Has Keywords:", hasKeywords); // Debug log

        if (!hasKeywords) {
            console.log("Validation Failed: Missing keywords"); // Debug log
            return res.status(400).json({ error: "The uploaded file does not appear to be a valid resume. It's missing standard sections like 'Experience', 'Skills', or 'Education'." });
        }

        const jobRole = req.body.jobRole || 'General Role';

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(cleanText);
            // Add targetRole to response as it's needed by frontend
            jsonResponse.targetRole = jobRole;
            res.json(jsonResponse);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, cleanText);
            res.status(500).json({ error: 'Failed to parse AI response', raw: cleanText });
        }

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
